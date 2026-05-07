package com.booking.ticketservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Ticket extends PanacheEntity {
    public Long userId;
    public String ticketCode;
    public Long bookingId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public String status;
}
