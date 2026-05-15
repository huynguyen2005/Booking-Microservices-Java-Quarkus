package com.booking.paymentservice.event;

import java.math.BigDecimal;

public class BookingCreatedEvent {
    public Long bookingId;
    public Long userId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public BigDecimal amount;
    public String currency;
}
