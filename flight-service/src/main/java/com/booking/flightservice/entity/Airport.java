package com.booking.flightservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
@Entity
public class Airport extends PanacheEntity {
    public String code;
    public String name;
    public String city;
    public String imageUrl;
}
