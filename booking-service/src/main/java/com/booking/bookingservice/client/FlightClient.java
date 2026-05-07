package com.booking.bookingservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/api")
@RegisterRestClient(configKey = "flight-service")
public interface FlightClient {
    @GET @Path("/flights/{id}") Object getFlight(@PathParam("id") Long id, @HeaderParam("Authorization") String authorization);
    @GET @Path("/seats/availability") boolean isAvailable(@QueryParam("flightId") Long flightId,@QueryParam("seatNumber") String seatNumber, @HeaderParam("Authorization") String authorization);
}
