package com.booking.passengerservice.resource;

import com.booking.passengerservice.entity.Passenger;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.Instant;
import java.util.List;

@Path("/api/passengers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class PassengerResource {

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed("ADMIN")
    public List<Passenger> all() {
        return Passenger.list("deleted = false");
    }

    @GET
    @Path("/me")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Passenger> me() {
        return Passenger.list("userId = ?1 and deleted = false", currentUserId());
    }

    @GET
    @Path("/search")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Passenger> search(@QueryParam("keyword") String keyword) {
        String q = keyword == null ? "" : keyword.trim();
        String like = "%" + q.toLowerCase() + "%";
        if (isAdmin()) {
            if (q.isEmpty()) {
                return Passenger.list("deleted = false");
            }
            return Passenger.find(
                    "deleted = false and (lower(fullName) like ?1 or lower(email) like ?1 or lower(passportNumber) like ?1)",
                    like
            ).list();
        }
        if (q.isEmpty()) {
            return Passenger.list("userId = ?1 and deleted = false", currentUserId());
        }
        return Passenger.find(
                "userId = ?1 and deleted = false and (lower(fullName) like ?2 or lower(email) like ?2 or lower(passportNumber) like ?2)",
                currentUserId(),
                like
        ).list();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"USER", "ADMIN"})
    public Passenger byId(@PathParam("id") Long id) {
        Passenger passenger = findByIdOrThrow(id);
        assertOwnership(passenger);
        return passenger;
    }

    @POST
    @RolesAllowed({"USER", "ADMIN"})
    @Transactional
    public Passenger create(Passenger p) {
        if (isAdmin()) {
            if (p.userId == null) {
                p.userId = currentUserId();
            }
        } else {
            p.userId = currentUserId();
        }
        p.deleted = false;
        p.deletedAt = null;
        p.persist();
        return p;
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"USER", "ADMIN"})
    @Transactional
    public Passenger update(@PathParam("id") Long id, Passenger input) {
        if (isAdmin()) {
            throw new ForbiddenException("Admin không được sửa thông tin passenger");
        }
        Passenger passenger = findByIdOrThrow(id);
        assertOwnership(passenger);
        passenger.fullName = input.fullName;
        passenger.email = input.email;
        passenger.phone = input.phone;
        passenger.passportNumber = input.passportNumber;
        return passenger;
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"USER", "ADMIN"})
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Passenger passenger = findByIdOrThrow(id);
        assertOwnership(passenger);
        passenger.deleted = true;
        passenger.deletedAt = Instant.now();
    }

    private Passenger findByIdOrThrow(Long id) {
        Passenger passenger = Passenger.find("id = ?1 and deleted = false", id).firstResult();
        if (passenger == null) {
            throw new NotFoundException("Passenger not found");
        }
        return passenger;
    }

    private void assertOwnership(Passenger passenger) {
        if (isAdmin()) {
            return;
        }
        if (passenger.userId == null || passenger.userId.longValue() != currentUserId()) {
            throw new ForbiddenException("Not your passenger");
        }
    }

    private boolean isAdmin() {
        return jwt.getGroups().contains("ADMIN");
    }

    private long currentUserId() {
        try {
            return Long.parseLong(jwt.getSubject());
        } catch (Exception e) {
            throw new ForbiddenException("Invalid token subject");
        }
    }
}
