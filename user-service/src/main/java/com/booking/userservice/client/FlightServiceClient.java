package com.booking.userservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.HeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;
import java.util.Map;

@Path("/api")
@RegisterRestClient(configKey = "flight-service")
public interface FlightServiceClient {
    @GET
    @Path("/airports")
    List<Map<String, Object>> airports(@HeaderParam("Authorization") String authorization);

    @GET
    @Path("/airplanes")
    List<Map<String, Object>> airplanes(@HeaderParam("Authorization") String authorization);

    @GET
    @Path("/flights")
    List<Map<String, Object>> flights(@HeaderParam("Authorization") String authorization);

    @GET
    @Path("/seats")
    List<Map<String, Object>> seats(@HeaderParam("Authorization") String authorization);
}
