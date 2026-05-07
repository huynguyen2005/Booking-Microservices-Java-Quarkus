package com.booking.userservice.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;
import java.util.Map;

@Path("/api/payments")
@RegisterRestClient(configKey = "payment-service")
public interface PaymentServiceClient {
    @GET
    List<Map<String, Object>> all(@HeaderParam("Authorization") String authorization);
}
