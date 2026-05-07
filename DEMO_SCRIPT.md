# DEMO SCRIPT - Booking Microservices Quarkus

## 1. Mở đầu (30-60 giây)

- Đây là hệ thống đặt vé máy bay theo kiến trúc microservices.
- Backend viết bằng Java Quarkus, DB PostgreSQL, message broker RabbitMQ.
- Frontend tách 2 khu: User Booking Website và Admin Dashboard.

## 2. Kiến trúc microservices (1-2 phút)

Service chính:
- `api-gateway`: cổng vào duy nhất cho frontend
- `user-service`: auth + users + dashboard summary
- `flight-service`: airports, airplanes, flights, seats
- `passenger-service`: passenger theo ownership
- `booking-service`: tạo booking, kiểm tra flight/seat/passenger
- `payment-service`: tạo + cập nhật payment từ event booking
- `ticket-service`: sinh vé từ payment completed
- `checkin-service`: check-in theo ticket
- `notification-service`: log event

Luồng event:
- BookingCreated -> PaymentCreated(PENDING) -> PaymentCompleted -> TicketIssued -> CheckinCompleted

## 3. Vì sao chọn Quarkus (30-45 giây)

- Khởi động nhanh, nhẹ RAM, phù hợp container/Kubernetes.
- Extension đủ cho REST, Panache ORM, JWT, RabbitMQ.
- Cấu trúc code gọn, dễ demo và bảo vệ đồ án.

## 4. PostgreSQL + RabbitMQ (30-45 giây)

- PostgreSQL: 1 instance, nhiều DB theo service.
- RabbitMQ: xử lý tác vụ bất đồng bộ, tách service khỏi coupling đồng bộ.

## 5. JWT + RBAC + Ownership (1 phút)

- JWT do `user-service` phát hành.
- Role:
  - `USER`: chỉ dữ liệu của chính mình
  - `ADMIN`: quản trị toàn hệ thống
- Ownership check theo `userId` trong token và entity/event.

## 6. Demo Docker Compose (1 phút)

Lệnh:
```bash
docker compose up --build -d
docker compose ps
```

Điểm nhấn:
- Có healthcheck + depends_on condition service_healthy.
- Chờ 10-20 giây cho hệ thống stable.

## 7. Demo User flow (2-3 phút)

1. Register user
2. Login user
3. Xem flights
4. Thêm passenger
5. Tạo booking
6. Thanh toán `pay`
7. Xem ticket (boarding pass)
8. Check-in theo `ticketCode`
9. Logout

Nếu ticket chưa xuất hiện ngay: giải thích async event, chờ 1-3 giây rồi refresh.

## 8. Demo Admin flow (2-3 phút)

Dùng account seed:
- `admin@gmail.com / admin123`

Trình diễn:
1. Dashboard summary
2. Users list
3. Airports CRUD
4. Airplanes CRUD
5. Flights list
6. Seats list
7. Passengers list
8. Bookings list
9. Payments list
10. Tickets list
11. Checkins list

## 9. Demo Kubernetes (tuỳ thời gian, 1-2 phút)

```bash
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/postgres.yml
kubectl apply -f k8s/rabbitmq.yml
kubectl apply -f k8s/*.yml
```

Nói ngắn:
- Kiến trúc đã chuẩn container, có manifest sẵn.
- Gateway/Ingress làm cổng vào trong cluster.

## 10. Câu hỏi giáo viên có thể hỏi + trả lời ngắn

1. Vì sao tách nhiều service?
- Để tách domain, dễ scale, dễ bảo trì, mô phỏng hệ thống thực tế.

2. Vì sao không gọi đồng bộ toàn bộ mà dùng RabbitMQ?
- Các bước payment/ticket/checkin phù hợp eventual consistency, giảm coupling.

3. Làm sao đảm bảo user không xem dữ liệu của nhau?
- Kiểm tra ownership bằng `userId` từ JWT ở từng service.

4. Nếu message bị trễ thì sao?
- Frontend polling nhẹ/retry; backend idempotent theo booking/payment/ticket key.

5. Nếu restart hệ thống có bị lỗi race không?
- Đã thêm healthcheck + depends_on service_healthy; vẫn khuyến nghị chờ 10-20 giây sau startup.

6. Vì sao chọn Quarkus thay Spring Boot cho đồ án này?
- Khởi động nhanh hơn, footprint nhỏ, native cloud tốt, phù hợp demo microservices.
