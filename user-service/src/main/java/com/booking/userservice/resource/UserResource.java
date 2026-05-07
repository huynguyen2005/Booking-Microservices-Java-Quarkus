package com.booking.userservice.resource;

import com.booking.userservice.dto.UpdateUserRequest;
import com.booking.userservice.dto.UserResponse;
import com.booking.userservice.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class UserResource {

    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @GET
    public List<UserResponse> all() {
        return userService.list();
    }

    @GET
    @Path("/{id}")
    public UserResponse get(@PathParam("id") Long id) {
        return userService.get(id);
    }

    @PUT
    @Path("/{id}")
    public UserResponse update(@PathParam("id") Long id, UpdateUserRequest request) {
        return userService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        userService.delete(id);
    }
}
