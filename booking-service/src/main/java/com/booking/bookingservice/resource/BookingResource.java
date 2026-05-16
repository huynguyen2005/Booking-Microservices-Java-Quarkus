package com.booking.bookingservice.resource;

import com.booking.bookingservice.client.FlightClient;
import com.booking.bookingservice.client.FlightView;
import com.booking.bookingservice.client.PassengerClient;
import com.booking.bookingservice.client.PassengerView;
import com.booking.bookingservice.client.PaymentClient;
import com.booking.bookingservice.client.TicketClient;
import com.booking.bookingservice.client.TicketView;
import com.booking.bookingservice.client.CheckinClient;
import com.booking.bookingservice.client.CheckinView;
import com.booking.bookingservice.entity.Booking;
import com.booking.bookingservice.entity.BookingCancelAudit;
import com.booking.bookingservice.event.BookingCancelledEvent;
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
import io.smallrye.reactive.messaging.MutinyEmitter;

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
    private static final String STATUS_PENDING_PAYMENT = "PENDING_PAYMENT";
    private static final String STATUS_CONFIRMED = "CONFIRMED";
    private static final String STATUS_CANCELLED = "CANCELLED";
    private static final String STATUS_EXPIRED = "EXPIRED";
    private record CreatedBooking(Booking booking, FlightView flight) {}
    public static class AdminCancelRequest {
        public String cancelReason;
    }

    @Inject @RestClient FlightClient flightClient;
    @Inject @RestClient PassengerClient passengerClient;
    @Inject @RestClient PaymentClient paymentClient;
    @Inject @RestClient TicketClient ticketClient;
    @Inject @RestClient CheckinClient checkinClient;
    @Inject @Channel("booking-created-out") Emitter<BookingCreatedEvent> emitter;
    @Inject @Channel("booking-cancelled-out") MutinyEmitter<BookingCancelledEvent> cancelEmitter;
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
        b.status = STATUS_PENDING_PAYMENT;
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
        if (isAdmin()) {
            throw new WebApplicationException("Admin must use /api/bookings/{id}/admin-cancel", 400);
        }
        if (STATUS_CONFIRMED.equalsIgnoreCase(booking.status)) {
            throw new WebApplicationException("Confirmed booking cannot be cancelled here", 409);
        }
        if (STATUS_CANCELLED.equalsIgnoreCase(booking.status) || STATUS_EXPIRED.equalsIgnoreCase(booking.status)) {
            return booking;
        }
        String oldStatus = booking.status;
        String authorization = headers.getHeaderString("Authorization");
        try {
            flightClient.releaseSeat(booking.flightId, booking.seatNumber, authorization);
        } catch (Exception ignored) {
        }
        expirePendingPayment(booking.id);
        booking.status = STATUS_CANCELLED;
        emitCancelledEvent(booking, oldStatus, "user_cancel", null);
        return booking;
    }

    @PUT
    @Path("/{id}/admin-cancel")
    @Transactional
    @RolesAllowed("ADMIN")
    public Booking adminCancel(@PathParam("id") Long id, AdminCancelRequest req, @Context HttpHeaders headers) {
        Booking booking = Booking.findById(id);
        assertOwnership(booking);
        if (STATUS_CANCELLED.equalsIgnoreCase(booking.status)) {
            return booking;
        }
        if (STATUS_EXPIRED.equalsIgnoreCase(booking.status)) {
            return booking;
        }
        if (!STATUS_PENDING_PAYMENT.equalsIgnoreCase(booking.status) && !STATUS_CONFIRMED.equalsIgnoreCase(booking.status)) {
            throw new WebApplicationException("Only PENDING_PAYMENT or CONFIRMED booking can be cancelled by admin", 409);
        }
        String reason = req == null || req.cancelReason == null ? "" : req.cancelReason.trim();
        if (reason.length() < 5) {
            throw new WebApplicationException("cancelReason is required and must be at least 5 characters", 400);
        }
        String oldStatus = booking.status;
        String authorization = headers.getHeaderString("Authorization");
        if (hasCheckedInTicket(booking.id, authorization)) {
            throw new WebApplicationException("Ticket already checked in. Admin cannot cancel this booking", 409);
        }
        try {
            flightClient.releaseSeat(booking.flightId, booking.seatNumber, authorization);
        } catch (Exception ignored) {
        }
        if (STATUS_PENDING_PAYMENT.equalsIgnoreCase(oldStatus)) {
            expirePendingPayment(booking.id);
        }
        booking.status = STATUS_CANCELLED;
        BookingCancelAudit audit = new BookingCancelAudit();
        audit.bookingId = booking.id;
        audit.adminId = currentUserId();
        audit.oldStatus = oldStatus;
        audit.newStatus = STATUS_CANCELLED;
        audit.reason = reason;
        audit.persist();
        emitCancelledEvent(booking, oldStatus, reason, audit.adminId);
        return booking;
    }

    private void expirePendingPayment(Long bookingId) {
        try {
            paymentClient.expirePaymentByBooking(bookingId);
        } catch (Exception ignored) {
        }
    }

    private void emitCancelledEvent(Booking booking, String oldStatus, String reason, Long adminId) {
        BookingCancelledEvent event = new BookingCancelledEvent();
        event.bookingId = booking.id;
        event.userId = booking.userId;
        event.passengerId = booking.passengerId;
        event.flightId = booking.flightId;
        event.seatNumber = booking.seatNumber;
        event.oldStatus = oldStatus;
        event.status = booking.status;
        event.reason = reason;
        event.cancelledByAdminId = adminId;
        cancelEmitter.sendAndAwait(event);
    }

    private boolean hasCheckedInTicket(Long bookingId, String authorization) {
        List<TicketView> tickets = ticketClient.byBooking(bookingId, authorization);
        if (tickets == null || tickets.isEmpty()) {
            return false;
        }
        for (TicketView ticket : tickets) {
            String ticketStatus = ticket.status() == null ? "" : ticket.status().trim().toUpperCase(Locale.ROOT);
            if ("CHECKED_IN".equals(ticketStatus)) {
                return true;
            }
            if (ticket.ticketCode() == null || ticket.ticketCode().isBlank()) {
                continue;
            }
            try {
                CheckinView checkin = checkinClient.byTicket(ticket.ticketCode(), authorization);
                String checkinStatus = checkin == null || checkin.status() == null ? "" : checkin.status().trim().toUpperCase(Locale.ROOT);
                if ("CHECKED_IN".equals(checkinStatus)) {
                    return true;
                }
            } catch (WebApplicationException e) {
                int code = e.getResponse() != null ? e.getResponse().getStatus() : 500;
                if (code != 404) {
                    throw e;
                }
            }
        }
        return false;
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
