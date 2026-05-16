package com.booking.bookingservice.client;

public record CheckinView(
        Long id,
        Long userId,
        String ticketCode,
        String status,
        Long bookingId,
        Long passengerId,
        Long flightId
) {
}
