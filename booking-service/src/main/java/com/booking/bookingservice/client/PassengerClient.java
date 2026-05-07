package com.booking.bookingservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api/passengers")
@RegisterRestClient(configKey = "passenger-service")
public interface PassengerClient {
    @GET
    @Path("/{id}")
    PassengerView getPassenger(@PathParam("id") Long id, @HeaderParam("Authorization") String authorization);
}
