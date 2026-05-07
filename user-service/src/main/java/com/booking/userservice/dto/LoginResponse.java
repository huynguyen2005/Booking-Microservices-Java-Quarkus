package com.booking.userservice.dto;

public record LoginResponse(String token, UserSummary user) {
}
