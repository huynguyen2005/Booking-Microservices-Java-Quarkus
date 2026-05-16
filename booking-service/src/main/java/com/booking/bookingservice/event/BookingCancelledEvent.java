package com.booking.bookingservice.event;

public class BookingCancelledEvent {
    public Long bookingId;
    public Long userId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public String oldStatus;
    public String status;
    public String reason;
    public Long cancelledByAdminId;
}

