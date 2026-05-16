package com.booking.bookingservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/checkins")
@RegisterRestClient(configKey = "checkin-service")
public interface CheckinClient {
    @GET
    @Path("/ticket/{ticketCode}")
    CheckinView byTicket(@PathParam("ticketCode") String ticketCode, @HeaderParam("Authorization") String authorization);
}
