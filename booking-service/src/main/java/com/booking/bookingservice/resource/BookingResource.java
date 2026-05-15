package com.booking.bookingservice.resource;

import com.booking.bookingservice.client.FlightClient;
import com.booking.bookingservice.client.FlightView;
import com.booking.bookingservice.client.PassengerClient;
import com.booking.bookingservice.client.PassengerView;
import com.booking.bookingservice.entity.Booking;
import com.booking.bookingservice.event.BookingCreatedEvent;
import com.booking.bookingservice.service.SeatLockService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.List;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Set;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class BookingResource {
    private static final Set<String> BOOKABLE_FLIGHT_STATUSES = Set.of("SCHEDULED");
    private record CreatedBooking(Booking booking, FlightView flight) {}
    @Inject @RestClient FlightClient flightClient;
    @Inject @RestClient PassengerClient passengerClient;
    @Inject @Channel("booking-created-out") Emitter<BookingCreatedEvent> emitter;
    @Inject SeatLockService seatLockService;
    @Inject JsonWebToken jwt;

    @GET @RolesAllowed("ADMIN") public List<Booking> all(){ return Booking.listAll(); }

    @GET
    @Path("/search")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Booking> search(
            @QueryParam("bookingId") Long bookingId,
            @QueryParam("passengerId") Long passengerId,
            @QueryParam("flightId") Long flightId,
            @QueryParam("status") String status
    ) {
        List<String> clauses = new ArrayList<>();
        List<Object> params = new ArrayList<>();

        if (bookingId != null) {
            clauses.add("id = ?" + (params.size() + 1));
            params.add(bookingId);
        }
        if (passengerId != null) {
            clauses.add("passengerId = ?" + (params.size() + 1));
            params.add(passengerId);
        }
        if (flightId != null) {
            clauses.add("flightId = ?" + (params.size() + 1));
            params.add(flightId);
        }
        if (status != null && !status.isBlank()) {
            clauses.add("upper(status) = ?" + (params.size() + 1));
            params.add(status.trim().toUpperCase());
        }
        if (!isAdmin()) {
            clauses.add("userId = ?" + (params.size() + 1));
            params.add(currentUserId());
        }
        if (clauses.isEmpty()) {
            return isAdmin() ? Booking.listAll() : Booking.list("userId", currentUserId());
        }
        return Booking.find(String.join(" and ", clauses), params.toArray()).list();
    }

    @GET
    @Path("/me")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Booking> me() {
        if (isAdmin()) {
            return Booking.listAll();
        }
        return Booking.list("userId", currentUserId());
    }

    @GET @Path("/{id}") @RolesAllowed({"USER", "ADMIN"})
    public Booking byId(@PathParam("id") Long id){
        Booking booking = Booking.findById(id);
        assertOwnership(booking);
        return booking;
    }

    @POST @RolesAllowed({"USER","ADMIN"})
    public Booking create(Booking b, @Context HttpHeaders headers){
        CreatedBooking created = createInTx(b, headers);
        BookingCreatedEvent e = new BookingCreatedEvent();
        e.bookingId = created.booking().id;
        e.userId = created.booking().userId;
        e.passengerId = created.booking().passengerId;
        e.flightId = created.booking().flightId;
        e.seatNumber = created.booking().seatNumber;
        if (created.flight() != null) {
            e.amount = created.flight().basePrice();
            e.currency = created.flight().currency();
        } else {
            e.currency = "VND";
        }
        emitter.send(e);
        return created.booking();
    }

    @Transactional
    CreatedBooking createInTx(Booking b, HttpHeaders headers) {
        if (b == null || b.flightId == null || b.seatNumber == null || b.seatNumber.isBlank()) {
            throw new WebApplicationException("flightId and seatNumber are required", 400);
        }
        String lockOwner = seatLockService.acquire(b.flightId, b.seatNumber);
        if (lockOwner == null) {
            throw new WebApplicationException("Seat is being booked by another request, please retry", 409);
        }
        String authorization = headers.getHeaderString("Authorization");
        boolean seatHeld = false;
        try {
        PassengerView passenger;
        try {
            passenger = passengerClient.getPassenger(b.passengerId, authorization);
        } catch (WebApplicationException e) {
            if (e.getResponse() != null && e.getResponse().getStatus() == 403) {
                throw new ForbiddenException("Passenger does not belong to current user");
            }
            throw e;
        }
        if(passenger==null) throw new WebApplicationException("Passenger not found",400);
        if(!isAdmin() && passenger.userId() != null && passenger.userId().longValue() != currentUserId()) {
            throw new ForbiddenException("Passenger does not belong to current user");
        }
        if(passenger.userId() == null && !isAdmin()) {
            throw new ForbiddenException("Passenger does not belong to current user");
        }
        FlightView flight;
        try {
            flight = flightClient.getFlight(b.flightId, authorization);
            if (flight == null) {
                throw new WebApplicationException("Flight not found", 400);
            }
            String status = flight.status() == null ? "" : flight.status().trim().toUpperCase(Locale.ROOT);
            if (!BOOKABLE_FLIGHT_STATUSES.contains(status)) {
                throw new WebApplicationException("Flight status does not allow booking: " + (flight.status() == null ? "UNKNOWN" : flight.status()), 409);
            }
            if (flight.basePrice() == null) {
                throw new WebApplicationException("Flight basePrice is required", 400);
            }
        } catch (WebApplicationException e) {
            int status = e.getResponse() != null ? e.getResponse().getStatus() : 500;
            if (status == 404) {
                throw new WebApplicationException("Flight not found", 400);
            }
            throw e;
        }

        try {
            flightClient.holdSeat(b.flightId, b.seatNumber, authorization);
            seatHeld = true;
        } catch (WebApplicationException e) {
            int status = e.getResponse() != null ? e.getResponse().getStatus() : 500;
            if (status == 404) {
                throw new WebApplicationException("Seat not found for this flight", 400);
            }
            if (status == 400) {
                throw new WebApplicationException("Seat is not available", 400);
            }
            if (status == 409) {
                throw new WebApplicationException("Seat is being booked by another request, please retry", 409);
            }
            throw new WebApplicationException("Cannot hold seat right now", Response.Status.BAD_GATEWAY);
        }
        b.userId = currentUserId();
        b.seatNumber = b.seatNumber.trim().toUpperCase();
        b.status="PENDING_PAYMENT";
        b.persist();
        return new CreatedBooking(b, flight);
        } catch (RuntimeException ex) {
            if (seatHeld) {
                try {
                    flightClient.releaseSeat(b.flightId, b.seatNumber, authorization);
                } catch (Exception ignored) {
                }
            }
            throw ex;
        } finally {
            seatLockService.release(b.flightId, b.seatNumber, lockOwner);
        }
    }

    @PUT
    @Path("/{id}/cancel")
    @Transactional
    @RolesAllowed({"USER","ADMIN"})
    public Booking cancel(@PathParam("id") Long id, @Context HttpHeaders headers) {
        Booking booking = Booking.findById(id);
        assertOwnership(booking);
        if ("CONFIRMED".equalsIgnoreCase(booking.status)) {
            throw new WebApplicationException("Confirmed booking cannot be cancelled here", 409);
        }
        if ("CANCELLED".equalsIgnoreCase(booking.status) || "EXPIRED".equalsIgnoreCase(booking.status)) {
            return booking;
        }
        String authorization = headers.getHeaderString("Authorization");
        try {
            flightClient.releaseSeat(booking.flightId, booking.seatNumber, authorization);
        } catch (Exception ignored) {
        }
        booking.status = "CANCELLED";
        return booking;
    }

    private long currentUserId() {
        try {
            return Long.parseLong(jwt.getSubject());
        } catch (Exception e) {
            throw new ForbiddenException("Invalid token subject");
        }
    }

    private boolean isAdmin() {
        return jwt.getGroups().contains("ADMIN");
    }

    private void assertOwnership(Booking booking) {
        if (booking == null) {
            throw new WebApplicationException("Booking not found", 404);
        }
        if (isAdmin()) {
            return;
        }
        if (booking.userId == null || booking.userId.longValue() != currentUserId()) {
            throw new ForbiddenException("Not your booking");
        }
    }
}
