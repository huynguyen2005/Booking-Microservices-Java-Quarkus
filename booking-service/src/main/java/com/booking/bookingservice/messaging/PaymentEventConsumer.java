package com.booking.bookingservice.messaging;

import com.booking.bookingservice.client.FlightClient;
import com.booking.bookingservice.entity.Booking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class PaymentEventConsumer {
    @Inject
    @RestClient
    FlightClient flightClient;

    @Incoming("payment-completed-in")
    @Transactional
    public void onPaymentCompleted(io.vertx.core.json.JsonObject event) {
        Long bookingId = event.getLong("bookingId");
        if (bookingId == null) {
            return;
        }
        Booking booking = Booking.findById(bookingId);
        if (booking == null) {
            return;
        }
        if ("CONFIRMED".equalsIgnoreCase(booking.status)) {
            return;
        }
        flightClient.confirmSeat(booking.flightId, booking.seatNumber, null);
        booking.status = "CONFIRMED";
    }

    @Incoming("payment-failed-in")
    @Transactional
    public void onPaymentFailed(io.vertx.core.json.JsonObject event) {
        Long bookingId = event.getLong("bookingId");
        if (bookingId == null) {
            return;
        }
        Booking booking = Booking.findById(bookingId);
        if (booking == null) {
            return;
        }
        if ("CONFIRMED".equalsIgnoreCase(booking.status)) {
            return;
        }
        if ("CANCELLED".equalsIgnoreCase(booking.status) || "EXPIRED".equalsIgnoreCase(booking.status)) {
            return;
        }
        flightClient.releaseSeat(booking.flightId, booking.seatNumber, null);
        booking.status = "CANCELLED";
    }
}
