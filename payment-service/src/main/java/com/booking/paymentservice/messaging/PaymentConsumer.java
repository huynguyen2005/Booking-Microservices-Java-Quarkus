package com.booking.paymentservice.messaging;
import com.booking.paymentservice.entity.Payment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import io.vertx.core.json.JsonObject;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import java.math.BigDecimal;
@ApplicationScoped
public class PaymentConsumer {
    @Incoming("booking-created-in")
    @Transactional
    public void consume(JsonObject event){
        Payment p=new Payment();
        p.userId=event.getLong("userId");
        p.bookingId=event.getLong("bookingId");
        p.passengerId=event.getLong("passengerId");
        p.flightId=event.getLong("flightId");
        p.seatNumber=event.getString("seatNumber");
        Object amountRaw = event.getValue("amount");
        if (amountRaw != null) {
            p.amount = new BigDecimal(String.valueOf(amountRaw));
        }
        String currency = event.getString("currency");
        p.currency = (currency == null || currency.isBlank()) ? "VND" : currency.trim().toUpperCase();
        p.status="PENDING";
        p.persist();
    }
}
