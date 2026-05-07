package com.booking.notificationservice.messaging;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.reactive.messaging.Incoming;
@ApplicationScoped
public class NotificationConsumer {
    @Incoming("booking-created-noti") public void booking(JsonObject e){ System.out.println("[NOTI] Booking created: "+e.getLong("bookingId")); }
    @Incoming("payment-completed-noti") public void payment(JsonObject e){ System.out.println("[NOTI] Payment completed: "+e.getLong("paymentId")); }
    @Incoming("ticket-issued-noti") public void ticket(JsonObject e){ System.out.println("[NOTI] Ticket issued: "+e.getString("ticketCode")); }
}
