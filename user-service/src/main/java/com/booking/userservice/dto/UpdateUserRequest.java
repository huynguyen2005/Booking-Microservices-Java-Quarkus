package com.booking.userservice.dto;

import com.booking.userservice.entity.Role;

public record UpdateUserRequest(String fullName, String email, String phone, String password, Role role) {
}
