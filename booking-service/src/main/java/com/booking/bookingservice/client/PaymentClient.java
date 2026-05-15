package com.booking.bookingservice.client;

import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/payments")
@RegisterRestClient(configKey = "payment-service")
public interface PaymentClient {
    @PUT
    @Path("/internal/booking/{bookingId}/expire")
    Object expirePaymentByBooking(@PathParam("bookingId") Long bookingId);
}

