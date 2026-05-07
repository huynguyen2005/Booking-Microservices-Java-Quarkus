package com.booking.userservice.dto;

import com.booking.userservice.entity.Role;

import java.time.Instant;

public record UserResponse(Long id, String fullName, String email, String phone, String avatarUrl, Role role, Instant createdAt) {
}
