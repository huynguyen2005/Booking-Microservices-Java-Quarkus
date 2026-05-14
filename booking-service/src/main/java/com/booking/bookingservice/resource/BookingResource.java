package com.booking.bookingservice.resource;

import com.booking.bookingservice.client.FlightClient;
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
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.List;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class BookingResource {
    @Inject @RestClient FlightClient flightClient;
    @Inject @RestClient PassengerClient passengerClient;
    @Inject @Channel("booking-created-out") Emitter<BookingCreatedEvent> emitter;
    @Inject SeatLockService seatLockService;
    @Inject JsonWebToken jwt;

    @GET @RolesAllowed("ADMIN") public List<Booking> all(){ return Booking.listAll(); }

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

    @POST @Transactional @RolesAllowed({"USER","ADMIN"})
    public Booking create(Booking b, @Context HttpHeaders headers){
        if (b == null || b.flightId == null || b.seatNumber == null || b.seatNumber.isBlank()) {
            throw new WebApplicationException("flightId and seatNumber are required", 400);
        }
        String lockOwner = seatLockService.acquire(b.flightId, b.seatNumber);
        if (lockOwner == null) {
            throw new WebApplicationException("Seat is being booked by another request, please retry", 409);
        }
        try {
        String authorization = headers.getHeaderString("Authorization");
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
        if(flightClient.getFlight(b.flightId, authorization)==null) throw new WebApplicationException("Flight not found",400);
        if(!flightClient.isAvailable(b.flightId,b.seatNumber, authorization)) throw new WebApplicationException("Seat not available",400);
        b.userId = currentUserId();
        b.status="CREATED";
        b.persist();
        BookingCreatedEvent e=new BookingCreatedEvent();
        e.bookingId=b.id; e.userId=b.userId; e.passengerId=b.passengerId; e.flightId=b.flightId; e.seatNumber=b.seatNumber;
        emitter.send(e);
        return b;
        } finally {
            seatLockService.release(b.flightId, b.seatNumber, lockOwner);
        }
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
