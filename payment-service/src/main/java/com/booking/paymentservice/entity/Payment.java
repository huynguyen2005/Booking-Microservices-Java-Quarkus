package com.booking.paymentservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Payment extends PanacheEntity {
    public Long userId;
    public Long bookingId;
    public Long passengerId;
    public Long flightId;
    public String status;
}
