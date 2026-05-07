package com.booking.userservice.dto;

import com.booking.userservice.entity.Role;

public record UserSummary(Long id, String fullName, String email, Role role) {
}
