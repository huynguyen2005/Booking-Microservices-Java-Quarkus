package com.booking.bookingservice.event;

public class PaymentCompletedEvent {
    public Long paymentId;
    public Long userId;
    public Long bookingId;
    public Long passengerId;
    public Long flightId;
    public String seatNumber;
    public String status;
}
