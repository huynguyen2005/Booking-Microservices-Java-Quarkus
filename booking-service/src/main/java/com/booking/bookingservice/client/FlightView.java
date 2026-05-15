package com.booking.bookingservice.client;

import java.math.BigDecimal;

public record FlightView(
        Long id,
        Long departureAirportId,
        Long arrivalAirportId,
        Long airplaneId,
        String flightNumber,
        String departureTime,
        String arrivalTime,
        String status,
        String imageUrl,
        BigDecimal basePrice,
        String currency
) {
}
