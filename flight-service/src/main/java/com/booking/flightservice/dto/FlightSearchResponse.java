package com.booking.flightservice.dto;

import com.booking.flightservice.entity.Flight;

import java.util.List;

public record FlightSearchResponse(
        List<Flight> items,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
