package com.booking.checkinservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/tickets")
@RegisterRestClient(configKey = "ticket-service")
public interface TicketClient {
    @GET
    @Path("/code/{ticketCode}")
    TicketView byCode(@PathParam("ticketCode") String ticketCode, @HeaderParam("Authorization") String authorization);
}
