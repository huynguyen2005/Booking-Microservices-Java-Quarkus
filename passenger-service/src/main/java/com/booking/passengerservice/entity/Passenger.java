package com.booking.passengerservice.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Passenger extends PanacheEntity {
    @Column(name = "user_id", nullable = false)
    public Long userId;
    public String fullName;
    public String email;
    public String phone;
    public String passportNumber;
}
