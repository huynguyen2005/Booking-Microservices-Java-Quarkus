package com.booking.userservice.resource;

import com.booking.userservice.dto.LoginRequest;
import com.booking.userservice.dto.LoginResponse;
import com.booking.userservice.dto.RegisterRequest;
import com.booking.userservice.dto.UserResponse;
import com.booking.userservice.service.UserService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    private final UserService userService;
    private final JsonWebToken jwt;

    public AuthResource(UserService userService, JsonWebToken jwt) {
        this.userService = userService;
        this.jwt = jwt;
    }

    @POST
    @Path("/register")
    @PermitAll
    public Response register(RegisterRequest request) {
        return Response.status(Response.Status.CREATED).entity(userService.register(request)).build();
    }

    @POST
    @Path("/login")
    @PermitAll
    public LoginResponse login(LoginRequest request) {
        return userService.login(request);
    }

    @GET
    @Path("/me")
    @Authenticated
    public UserResponse me() {
        return userService.me(jwt.getSubject());
    }
}
