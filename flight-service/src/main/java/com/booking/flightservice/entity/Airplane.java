package com.booking.flightservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Airplane extends PanacheEntity {
    public String code;
    public String model;
    public int totalSeats;
    public String imageUrl;
}
