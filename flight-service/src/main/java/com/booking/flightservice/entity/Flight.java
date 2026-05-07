package com.booking.flightservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Flight extends PanacheEntity {
    public Long departureAirportId;
    public Long arrivalAirportId;
    public Long airplaneId;
    public String flightNumber;
    public String departureTime;
    public String arrivalTime;
    public String status;
    public String imageUrl;
}
