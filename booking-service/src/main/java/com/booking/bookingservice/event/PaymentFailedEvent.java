package com.booking.bookingservice.event;

public class PaymentFailedEvent {
    public Long paymentId;
    public Long userId;
    public Long bookingId;
    public String status;
}
