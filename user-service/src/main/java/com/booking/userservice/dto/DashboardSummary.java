package com.booking.userservice.dto;

public record DashboardSummary(
        long usersTotal,
        long adminUsersTotal,
        long airportsTotal,
        long airplanesTotal,
        long flightsTotal,
        long seatsTotal,
        long passengersTotal,
        long bookingsTotal,
        long paymentsTotal,
        long pendingPaymentsTotal,
        long paidPaymentsTotal,
        long failedPaymentsTotal,
        long ticketsTotal,
        long checkinsTotal
) {
}
