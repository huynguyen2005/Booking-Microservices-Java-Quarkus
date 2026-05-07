package com.booking.checkinservice.client;

public record TicketView(Long id, Long userId, String ticketCode, Long bookingId, Long passengerId, Long flightId, String seatNumber, String status) {
}
