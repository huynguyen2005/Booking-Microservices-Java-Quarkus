package com.booking.paymentservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import java.math.BigDecimal;
import java.time.Instant;
@Entity
public class Payment extends PanacheEntity {
    public Long userId;
    public Long bookingId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public BigDecimal amount;
    public String currency;
    public Instant paidAt;
    public String status;
}
