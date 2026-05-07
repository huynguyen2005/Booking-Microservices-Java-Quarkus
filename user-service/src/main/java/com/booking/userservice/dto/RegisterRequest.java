package com.booking.userservice.dto;

public record RegisterRequest(String fullName, String email, String password, String phone) {
}
