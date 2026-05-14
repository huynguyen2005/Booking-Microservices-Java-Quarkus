package com.booking.ticketservice.resource;

import com.booking.ticketservice.entity.Ticket;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.ArrayList;

@Path("/api/tickets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class TicketResource {
    @Inject JsonWebToken jwt;

    @GET @RolesAllowed("ADMIN")
    public List<Ticket> all() {
        return Ticket.listAll();
    }

    @GET @Path("/me") @RolesAllowed({"USER", "ADMIN"})
    public List<Ticket> me() {
        if (jwt.getGroups().contains("ADMIN")) {
            return Ticket.listAll();
        }
        return Ticket.list("userId", currentUserId());
    }

    @GET @Path("/booking/{bookingId}") @RolesAllowed({"USER", "ADMIN"})
    public List<Ticket> byBooking(@PathParam("bookingId") Long bookingId){
        List<Ticket> tickets = Ticket.list("bookingId",bookingId);
        assertOwnership(tickets);
        return tickets;
    }

    @GET @Path("/passenger/{passengerId}") @RolesAllowed({"USER", "ADMIN"})
    public List<Ticket> byPassenger(@PathParam("passengerId") Long passengerId){
        List<Ticket> tickets = Ticket.list("passengerId",passengerId);
        assertOwnership(tickets);
        return tickets;
    }

    @GET @Path("/code/{ticketCode}") @RolesAllowed({"USER", "ADMIN"})
    public Ticket byCode(@PathParam("ticketCode") String ticketCode){
        Ticket ticket = Ticket.find("ticketCode",ticketCode).firstResult();
        assertOwnership(ticket);
        return ticket;
    }

    @GET
    @Path("/search")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Ticket> search(
            @QueryParam("ticketCode") String ticketCode,
            @QueryParam("status") String status,
            @QueryParam("userId") Long userId
    ) {
        List<String> clauses = new ArrayList<>();
        List<Object> params = new ArrayList<>();

        if (ticketCode != null && !ticketCode.isBlank()) {
            clauses.add("lower(ticketCode) like ?" + (params.size() + 1));
            params.add("%" + ticketCode.trim().toLowerCase() + "%");
        }
        if (status != null && !status.isBlank()) {
            clauses.add("upper(status) = ?" + (params.size() + 1));
            params.add(status.trim().toUpperCase());
        }
        if (jwt.getGroups().contains("ADMIN")) {
            if (userId != null) {
                clauses.add("userId = ?" + (params.size() + 1));
                params.add(userId);
            }
        } else {
            clauses.add("userId = ?" + (params.size() + 1));
            params.add(currentUserId());
        }

        if (clauses.isEmpty()) {
            return jwt.getGroups().contains("ADMIN") ? Ticket.listAll() : Ticket.list("userId", currentUserId());
        }
        return Ticket.find(String.join(" and ", clauses), params.toArray()).list();
    }

    private void assertOwnership(List<Ticket> tickets) {
        if (jwt.getGroups().contains("ADMIN")) {
            return;
        }
        long userId = currentUserId();
        for (Ticket ticket : tickets) {
            if (ticket.userId == null || ticket.userId.longValue() != userId) {
                throw new ForbiddenException("Not your ticket");
            }
        }
    }

    private void assertOwnership(Ticket ticket) {
        if (ticket == null) {
            throw new NotFoundException();
        }
        if (jwt.getGroups().contains("ADMIN")) {
            return;
        }
        long userId = currentUserId();
        if (ticket.userId == null || ticket.userId.longValue() != userId) {
            throw new ForbiddenException("Not your ticket");
        }
    }

    private long currentUserId() {
        try {
            return Long.parseLong(jwt.getSubject());
        } catch (Exception e) {
            throw new ForbiddenException("Invalid token subject");
        }
    }
}
