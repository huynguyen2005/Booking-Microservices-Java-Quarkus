package com.booking.paymentservice.resource;

import com.booking.paymentservice.entity.Payment;
import com.booking.paymentservice.event.PaymentFailedEvent;
import io.quarkus.narayana.jta.QuarkusTransaction;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

@Path("/api/payments/internal")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentInternalResource {
    @Inject
    @Channel("payment-failed-out")
    Emitter<PaymentFailedEvent> failed;

    @PUT
    @Path("/booking/{bookingId}/expire")
    @PermitAll
    public Payment expireByBooking(@PathParam("bookingId") Long bookingId) {
        Payment p = QuarkusTransaction.requiringNew().call(() -> {
            Payment found = Payment.find("bookingId", bookingId).firstResult();
            if (found == null) {
                return null;
            }
            if ("PAID".equalsIgnoreCase(found.status) || "FAILED".equalsIgnoreCase(found.status)) {
                return found;
            }
            found.status = "FAILED";
            found.paidAt = null;
            found.persistAndFlush();
            return found;
        });
        if (p == null) {
            return null;
        }
        PaymentFailedEvent e = new PaymentFailedEvent();
        e.paymentId = p.id;
        e.userId = p.userId;
        e.bookingId = p.bookingId;
        e.status = p.status;
        failed.send(e);
        return p;
    }
}

