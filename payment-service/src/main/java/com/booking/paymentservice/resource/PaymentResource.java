package com.booking.paymentservice.resource;

import com.booking.paymentservice.entity.Payment;
import com.booking.paymentservice.event.PaymentCompletedEvent;
import com.booking.paymentservice.event.PaymentFailedEvent;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import java.util.List;
import java.util.ArrayList;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class PaymentResource {
    @Inject @Channel("payment-completed-out") Emitter<PaymentCompletedEvent> completed;
    @Inject @Channel("payment-failed-out") Emitter<PaymentFailedEvent> failed;
    @Inject JsonWebToken jwt;

    @GET @RolesAllowed("ADMIN")
    public List<Payment> all() { return Payment.listAll(); }

    @GET
    @Path("/search")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Payment> search(
            @QueryParam("paymentId") Long paymentId,
            @QueryParam("bookingId") Long bookingId,
            @QueryParam("status") String status
    ) {
        List<String> clauses = new ArrayList<>();
        List<Object> params = new ArrayList<>();

        if (paymentId != null) {
            clauses.add("id = ?" + (params.size() + 1));
            params.add(paymentId);
        }
        if (bookingId != null) {
            clauses.add("bookingId = ?" + (params.size() + 1));
            params.add(bookingId);
        }
        if (status != null && !status.isBlank()) {
            clauses.add("upper(status) = ?" + (params.size() + 1));
            params.add(status.trim().toUpperCase());
        }
        if (!jwt.getGroups().contains("ADMIN")) {
            clauses.add("userId = ?" + (params.size() + 1));
            params.add(currentUserId());
        }

        if (clauses.isEmpty()) {
            return jwt.getGroups().contains("ADMIN") ? Payment.listAll() : Payment.list("userId", currentUserId());
        }
        return Payment.find(String.join(" and ", clauses), params.toArray()).list();
    }

    @GET @Path("/me") @RolesAllowed({"USER", "ADMIN"})
    public List<Payment> me() {
        if (jwt.getGroups().contains("ADMIN")) {
            return Payment.listAll();
        }
        return Payment.list("userId", currentUserId());
    }

    @GET @Path("/booking/{bookingId}") @RolesAllowed({"USER", "ADMIN"})
    public Payment byBooking(@PathParam("bookingId") Long bookingId) {
        Payment payment = Payment.find("bookingId", bookingId).firstResult();
        assertOwnership(payment);
        return payment;
    }

    @POST @Path("/{id}/simulate-success") @RolesAllowed({"USER", "ADMIN"})
    public Payment simulateSuccess(@PathParam("id") Long id) {
        Payment p = QuarkusTransaction.requiringNew().call(() -> {
            Payment found = Payment.findById(id);
            assertOwnership(found);
            if (found == null) { throw new NotFoundException(); }
            found.status = "PAID";
            found.persistAndFlush();
            return found;
        });
        PaymentCompletedEvent e = new PaymentCompletedEvent();
        e.paymentId = p.id; e.userId = p.userId; e.bookingId = p.bookingId; e.passengerId = p.passengerId; e.flightId = p.flightId; e.status = p.status;
        completed.send(e);
        return p;
    }

    @POST @Path("/{id}/simulate-fail") @RolesAllowed({"USER", "ADMIN"})
    public Payment simulateFail(@PathParam("id") Long id) {
        Payment p = QuarkusTransaction.requiringNew().call(() -> {
            Payment found = Payment.findById(id);
            assertOwnership(found);
            if (found == null) { throw new NotFoundException(); }
            found.status = "FAILED";
            found.persistAndFlush();
            return found;
        });
        PaymentFailedEvent e = new PaymentFailedEvent();
        e.paymentId = p.id; e.userId = p.userId; e.bookingId = p.bookingId; e.status = p.status;
        failed.send(e);
        return p;
    }

    @PUT @Path("/{id}/fail") @RolesAllowed("ADMIN")
    public Payment fail(@PathParam("id") Long id) {
        Payment p = QuarkusTransaction.requiringNew().call(() -> {
            Payment found = Payment.findById(id);
            if (found == null) { throw new NotFoundException(); }
            found.status = "FAILED";
            found.persistAndFlush();
            return found;
        });
        PaymentFailedEvent e = new PaymentFailedEvent();
        e.paymentId = p.id; e.userId = p.userId; e.bookingId = p.bookingId; e.status = p.status;
        failed.send(e);
        return p;
    }

    private void assertOwnership(Payment payment) {
        if (payment == null) {
            throw new NotFoundException();
        }
        if (jwt.getGroups().contains("ADMIN")) {
            return;
        }
        if (payment.userId == null || payment.userId.longValue() != currentUserId()) {
            throw new ForbiddenException("Not your payment");
        }
    }

    private long currentUserId() {
        try {
            return Long.parseLong(jwt.getSubject());
        } catch (Exception e) {
            throw new ForbiddenException("Invalid token subject");
        }
    }
}
