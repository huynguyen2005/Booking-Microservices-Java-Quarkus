package com.booking.apigateway.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import io.smallrye.common.annotation.Blocking;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.WILDCARD)
public class GatewayResource {

    private static final Set<String> HOP_BY_HOP_HEADERS = Set.of(
            "connection",
            "keep-alive",
            "proxy-authenticate",
            "proxy-authorization",
            "te",
            "trailers",
            "transfer-encoding",
            "upgrade",
            "expect",
            "host",
            "content-length"
    );

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    @ConfigProperty(name = "gateway.user-service-url")
    String userServiceUrl;

    @ConfigProperty(name = "gateway.flight-service-url")
    String flightServiceUrl;

    @ConfigProperty(name = "gateway.passenger-service-url")
    String passengerServiceUrl;

    @ConfigProperty(name = "gateway.booking-service-url")
    String bookingServiceUrl;

    @ConfigProperty(name = "gateway.payment-service-url")
    String paymentServiceUrl;

    @ConfigProperty(name = "gateway.ticket-service-url")
    String ticketServiceUrl;

    @ConfigProperty(name = "gateway.checkin-service-url")
    String checkinServiceUrl;

    @GET
    public Map<String, Object> home() {
        return Map.of(
                "message", "API Gateway is running",
                "mode", "reverse-proxy",
                "frontendBaseUrl", "http://localhost:8080"
        );
    }

    @GET
    @Blocking
    @Path("api/{path: .*}")
    public Response get(@PathParam("path") String path, @Context UriInfo uriInfo, @Context HttpHeaders headers) {
        return proxy("GET", "api/" + path, uriInfo, headers, null);
    }

    @POST
    @Blocking
    @Path("api/{path: .*}")
    public Response post(@PathParam("path") String path, @Context UriInfo uriInfo, @Context HttpHeaders headers, byte[] body) {
        return proxy("POST", "api/" + path, uriInfo, headers, body);
    }

    @PUT
    @Blocking
    @Path("api/{path: .*}")
    public Response put(@PathParam("path") String path, @Context UriInfo uriInfo, @Context HttpHeaders headers, byte[] body) {
        return proxy("PUT", "api/" + path, uriInfo, headers, body);
    }

    @DELETE
    @Blocking
    @Path("api/{path: .*}")
    public Response delete(@PathParam("path") String path, @Context UriInfo uriInfo, @Context HttpHeaders headers) {
        return proxy("DELETE", "api/" + path, uriInfo, headers, null);
    }

    @PATCH
    @Blocking
    @Path("api/{path: .*}")
    public Response patch(@PathParam("path") String path, @Context UriInfo uriInfo, @Context HttpHeaders headers, byte[] body) {
        return proxy("PATCH", "api/" + path, uriInfo, headers, body);
    }

    private Response proxy(String method, String path, UriInfo uriInfo, HttpHeaders headers, byte[] body) {
        System.out.println("[gateway] proxy start method=" + method + " path=" + path);
        URI target = resolveTarget(path, uriInfo);
        if (target == null) {
            throw new WebApplicationException("No route for path: " + path, 404);
        }
        System.out.println("[gateway] target=" + target);

        HttpRequest.Builder builder = HttpRequest.newBuilder(target)
                .timeout(Duration.ofSeconds(15));

        copyHeaders(headers, builder);
        builder.header("X-Forwarded-Host", "localhost:8080");
        builder.header("X-Forwarded-Proto", "http");
        builder.header("X-Forwarded-Port", "8080");

        if (body != null && body.length > 0 && !method.equals("GET") && !method.equals("DELETE")) {
            builder.header("Content-Type", headers.getHeaderString("Content-Type") == null ? MediaType.APPLICATION_JSON : headers.getHeaderString("Content-Type"));
            builder.method(method, HttpRequest.BodyPublishers.ofByteArray(body));
        } else {
            builder.method(method, HttpRequest.BodyPublishers.noBody());
        }

        try {
            HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            System.out.println("[gateway] response status=" + response.statusCode() + " path=" + path);
            Response.ResponseBuilder out = Response.status(response.statusCode());
            response.headers().map().forEach((name, values) -> {
                if (!HOP_BY_HOP_HEADERS.contains(name.toLowerCase())) {
                    for (String value : values) {
                        out.header(name, value);
                    }
                }
            });
            String contentType = response.headers().firstValue("content-type").orElse(MediaType.APPLICATION_JSON);
            out.type(contentType);
            out.entity(response.body());
            return out.build();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new WebApplicationException("Gateway request interrupted", 503);
        } catch (IOException e) {
            throw new WebApplicationException("Gateway request failed: " + e.getMessage(), 503);
        }
    }

    private void copyHeaders(HttpHeaders headers, HttpRequest.Builder builder) {
        MultivaluedMap<String, String> requestHeaders = headers.getRequestHeaders();
        for (Map.Entry<String, List<String>> entry : requestHeaders.entrySet()) {
            String headerName = entry.getKey();
            if (headerName == null || HOP_BY_HOP_HEADERS.contains(headerName.toLowerCase())) {
                continue;
            }
            for (String value : entry.getValue()) {
                if (value != null) {
                    builder.header(headerName, value);
                }
            }
        }
    }

    private URI resolveTarget(String path, UriInfo uriInfo) {
        String base = routeBase(path);
        if (base == null) {
            return null;
        }
        String query = uriInfo.getRequestUri().getRawQuery();
        String targetBase = switch (base) {
            case "user" -> userServiceUrl;
            case "flight" -> flightServiceUrl;
            case "passenger" -> passengerServiceUrl;
            case "booking" -> bookingServiceUrl;
            case "payment" -> paymentServiceUrl;
            case "ticket" -> ticketServiceUrl;
            case "checkin" -> checkinServiceUrl;
            default -> null;
        };
        if (targetBase == null || targetBase.isBlank()) {
            return null;
        }
        String target = targetBase.endsWith("/") ? targetBase.substring(0, targetBase.length() - 1) : targetBase;
        target += "/" + path;
        if (query != null && !query.isBlank()) {
            target += "?" + query;
        }
        return URI.create(target);
    }

    private String routeBase(String path) {
        if (path == null || path.isBlank()) {
            return null;
        }
        if (path.startsWith("api/auth") || path.startsWith("api/users") || path.startsWith("api/admin/dashboard")) {
            return "user";
        }
        if (path.startsWith("api/airports") || path.startsWith("api/airplanes") || path.startsWith("api/flights") || path.startsWith("api/seats")) {
            return "flight";
        }
        if (path.startsWith("api/passengers")) {
            return "passenger";
        }
        if (path.startsWith("api/bookings")) {
            return "booking";
        }
        if (path.startsWith("api/payments")) {
            return "payment";
        }
        if (path.startsWith("api/tickets")) {
            return "ticket";
        }
        if (path.startsWith("api/checkins")) {
            return "checkin";
        }
        return null;
    }
}
