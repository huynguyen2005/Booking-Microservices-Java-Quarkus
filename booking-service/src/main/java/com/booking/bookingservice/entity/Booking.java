package com.booking.bookingservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Booking extends PanacheEntity {
    public Long userId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public String status;
}
