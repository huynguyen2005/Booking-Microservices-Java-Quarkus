package com.booking.bookingservice.client;

public record PassengerView(Long id, Long userId, String fullName, String email, String phone, String passportNumber) {
}
