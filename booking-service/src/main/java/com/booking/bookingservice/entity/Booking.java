package com.booking.bookingservice.entity;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
@Entity
public class Booking extends PanacheEntity {
    public Long userId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public String status;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now(ZoneOffset.UTC);
    }
}
