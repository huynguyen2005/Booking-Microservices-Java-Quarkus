package com.booking.userservice.resource;

import com.booking.userservice.client.BookingServiceClient;
import com.booking.userservice.client.CheckinServiceClient;
import com.booking.userservice.client.FlightServiceClient;
import com.booking.userservice.client.PassengerServiceClient;
import com.booking.userservice.client.PaymentServiceClient;
import com.booking.userservice.client.TicketServiceClient;
import com.booking.userservice.dto.DashboardSummary;
import com.booking.userservice.entity.AppUser;
import com.booking.userservice.entity.Role;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.List;
import java.util.Map;

@Path("/api/admin/dashboard")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class AdminDashboardResource {

    @Inject
    @RestClient
    FlightServiceClient flightServiceClient;

    @Inject
    @RestClient
    PassengerServiceClient passengerServiceClient;

    @Inject
    @RestClient
    BookingServiceClient bookingServiceClient;

    @Inject
    @RestClient
    PaymentServiceClient paymentServiceClient;

    @Inject
    @RestClient
    TicketServiceClient ticketServiceClient;

    @Inject
    @RestClient
    CheckinServiceClient checkinServiceClient;

    @GET
    @Path("/summary")
    public DashboardSummary summary(@Context HttpHeaders headers) {
        String authorization = headers.getHeaderString("Authorization");
        List<Map<String, Object>> payments = paymentServiceClient.all(authorization);
        return new DashboardSummary(
                AppUser.count(),
                AppUser.count("role", Role.ADMIN),
                count(flightServiceClient.airports(authorization)),
                count(flightServiceClient.airplanes(authorization)),
                count(flightServiceClient.flights(authorization)),
                count(flightServiceClient.seats(authorization)),
                count(passengerServiceClient.all(authorization)),
                count(bookingServiceClient.all(authorization)),
                payments.size(),
                countByStatus(payments, "PENDING"),
                countByStatus(payments, "PAID"),
                countByStatus(payments, "FAILED"),
                count(ticketServiceClient.all(authorization)),
                count(checkinServiceClient.all(authorization))
        );
    }

    private long count(List<?> list) {
        return list == null ? 0 : list.size();
    }

    private long countByStatus(List<Map<String, Object>> items, String status) {
        if (items == null) {
            return 0;
        }
        return items.stream()
                .filter(item -> status.equalsIgnoreCase(String.valueOf(item.get("status"))))
                .count();
    }
}
