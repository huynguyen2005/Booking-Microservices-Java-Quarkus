package com.booking.bookingservice.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
public class BookingCancelAudit extends PanacheEntity {
    public Long bookingId;
    public Long adminId;
    public String oldStatus;
    public String newStatus;
    public String reason;
    public LocalDateTime cancelledAt;

    @PrePersist
    void onCreate() {
        if (cancelledAt == null) {
            cancelledAt = LocalDateTime.now(ZoneOffset.UTC);
        }
    }
}

