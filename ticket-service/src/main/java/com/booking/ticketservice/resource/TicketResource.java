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
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;

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
