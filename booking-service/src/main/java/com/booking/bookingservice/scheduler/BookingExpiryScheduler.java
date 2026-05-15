package com.booking.bookingservice.scheduler;

import com.booking.bookingservice.client.FlightClient;
import com.booking.bookingservice.client.PaymentClient;
import com.booking.bookingservice.entity.Booking;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@ApplicationScoped
public class BookingExpiryScheduler {
    private static final long EXPIRY_MINUTES = 1L;

    @Inject
    @RestClient
    FlightClient flightClient;
    @Inject
    @RestClient
    PaymentClient paymentClient;

    @Scheduled(every = "1m")
    @Transactional
    void expirePendingBookings() {
        LocalDateTime threshold = LocalDateTime.now(ZoneOffset.UTC).minusMinutes(EXPIRY_MINUTES);
        List<Booking> stale = Booking.find("status = ?1 and createdAt < ?2", "PENDING_PAYMENT", threshold).list();
        for (Booking booking : stale) {
            try {
                flightClient.releaseSeat(booking.flightId, booking.seatNumber, null);
            } catch (Exception ignored) {
            }
            booking.status = "EXPIRED";
            try {
                paymentClient.expirePaymentByBooking(booking.id);
            } catch (Exception ignored) {
            }
        }
    }
}
