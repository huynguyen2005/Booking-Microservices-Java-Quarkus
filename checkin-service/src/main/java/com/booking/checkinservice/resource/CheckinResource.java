package com.booking.checkinservice.resource;

import com.booking.checkinservice.client.TicketClient;
import com.booking.checkinservice.client.TicketView;
import com.booking.checkinservice.entity.Checkin;
import com.booking.checkinservice.event.CheckinCompletedEvent;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import java.util.ArrayList;
import java.util.List;

@Path("/api/checkins")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class CheckinResource {
    @Inject @RestClient TicketClient ticketClient;
    @Inject @Channel("checkin-completed-out") Emitter<CheckinCompletedEvent> emitter;
    @Inject JsonWebToken jwt;

    @GET @RolesAllowed("ADMIN")
    public java.util.List<Checkin> all() {
        return Checkin.listAll();
    }

    @GET @Path("/me") @RolesAllowed({"USER", "ADMIN"})
    public java.util.List<Checkin> me() {
        if (jwt.getGroups().contains("ADMIN")) {
            return Checkin.listAll();
        }
        return Checkin.list("userId", currentUserId());
    }

    @POST @Transactional @RolesAllowed({"USER", "ADMIN"})
    public Checkin checkin(Checkin c, @Context HttpHeaders headers){
        String authorization = headers.getHeaderString("Authorization");
        TicketView ticket = ticketClient.byCode(c.ticketCode, authorization);
        assertOwnership(ticket);
        c.userId = ticket.userId();
        c.bookingId = ticket.bookingId();
        c.passengerId = ticket.passengerId();
        c.flightId = ticket.flightId();
        c.status="CHECKED_IN"; c.persist();
        CheckinCompletedEvent e=new CheckinCompletedEvent(); e.checkinId=c.id; e.userId=c.userId; e.ticketCode=c.ticketCode; e.status=c.status; emitter.send(e);
        return c;
    }

    @GET @Path("/ticket/{ticketCode}") @RolesAllowed({"USER", "ADMIN"}) public Checkin byTicket(@PathParam("ticketCode") String ticketCode){
        Checkin checkin = Checkin.find("ticketCode",ticketCode).firstResult();
        assertOwnership(checkin);
        return checkin;
    }

    @GET
    @Path("/search")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Checkin> search(
            @QueryParam("ticketCode") String ticketCode,
            @QueryParam("status") String status,
            @QueryParam("flightId") Long flightId
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
        if (flightId != null) {
            clauses.add("flightId = ?" + (params.size() + 1));
            params.add(flightId);
        }
        if (!jwt.getGroups().contains("ADMIN")) {
            clauses.add("userId = ?" + (params.size() + 1));
            params.add(currentUserId());
        }

        if (clauses.isEmpty()) {
            return jwt.getGroups().contains("ADMIN") ? Checkin.listAll() : Checkin.list("userId", currentUserId());
        }
        return Checkin.find(String.join(" and ", clauses), params.toArray()).list();
    }

    private void assertOwnership(TicketView ticket) {
        if (ticket == null) {
            throw new WebApplicationException("Ticket not found", 400);
        }
        if (jwt.getGroups().contains("ADMIN")) {
            return;
        }
        long userId = currentUserId();
        if (ticket.userId() == null || ticket.userId().longValue() != userId) {
            throw new ForbiddenException("Not your ticket");
        }
    }

    private void assertOwnership(Checkin checkin) {
        if (checkin == null) {
            throw new WebApplicationException("Checkin not found", 404);
        }
        if (jwt.getGroups().contains("ADMIN")) {
            return;
        }
        long userId = currentUserId();
        if (checkin.userId == null || checkin.userId.longValue() != userId) {
            throw new ForbiddenException("Not your checkin");
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
