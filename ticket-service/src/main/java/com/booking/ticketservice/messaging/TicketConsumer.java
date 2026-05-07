package com.booking.ticketservice.messaging;
import com.booking.ticketservice.entity.Ticket;
import com.booking.ticketservice.event.TicketIssuedEvent;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;
@ApplicationScoped
public class TicketConsumer {
    @Inject @Channel("ticket-issued-out") Emitter<TicketIssuedEvent> issued;
    @Incoming("payment-completed-in")
    @Transactional
    public void consume(JsonObject event){
        Ticket t=new Ticket();
        Long bookingId = event.getLong("bookingId");
        Long userId = event.getLong("userId");
        Long passengerId = event.getLong("passengerId");
        Long flightId = event.getLong("flightId");
        t.userId=userId;
        t.ticketCode="TKT-"+bookingId+"-"+System.currentTimeMillis();
        t.bookingId=bookingId; t.passengerId=passengerId; t.flightId=flightId; t.seatNumber="AUTO"; t.status="ISSUED";
        t.persist();
        TicketIssuedEvent out=new TicketIssuedEvent(); out.ticketId=t.id; out.userId=t.userId; out.ticketCode=t.ticketCode; out.bookingId=t.bookingId; out.passengerId=t.passengerId; out.flightId=t.flightId; out.status=t.status;
        issued.send(out);
    }
}
