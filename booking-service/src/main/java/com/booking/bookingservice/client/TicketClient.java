package com.booking.bookingservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@Path("/api/tickets")
@RegisterRestClient(configKey = "ticket-service")
public interface TicketClient {
    @GET
    @Path("/booking/{bookingId}")
    List<TicketView> byBooking(@PathParam("bookingId") Long bookingId, @HeaderParam("Authorization") String authorization);
}
