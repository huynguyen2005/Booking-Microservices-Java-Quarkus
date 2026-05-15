package com.booking.flightservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Seat extends PanacheEntity {
    public Long flightId;
    public String seatNumber;
    public boolean booked;
    public String status;
}
