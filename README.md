# Booking Microservices Java Quarkus

Hệ thống đặt vé máy bay theo kiến trúc microservices, xây dựng bằng **Java Quarkus**, sử dụng **PostgreSQL**, **RabbitMQ**, **Redis**, **Elasticsearch**, **JWT RBAC**, hỗ trợ chạy bằng **Docker Compose** và deploy trên **Kubernetes**.

Mục tiêu dự án:
- Dễ chạy local để demo.
- Thể hiện rõ kiến trúc microservices thực tế.
- Có đầy đủ luồng User và Admin.
- Có tích hợp upload ảnh bằng Cloudinary.

---

## 1) Kiến trúc microservices

```text
Frontend (React + Vite)
        |
        v
API Gateway (Quarkus) :8080
        |
        +--> user-service        :8088
        +--> flight-service      :8081
        +--> passenger-service   :8082
        +--> booking-service     :8083
        +--> payment-service     :8084
        +--> ticket-service      :8085
        +--> checkin-service     :8087
        +--> notification-service:8086

Async events: RabbitMQ
Cache/Lock: Redis
Search: Elasticsearch
Database: PostgreSQL (multi-database)
```

---

## 2) Danh sách service và port

| Service | Port | Vai trò |
|---|---:|---|
| api-gateway | 8080 | Cổng vào duy nhất cho frontend |
| flight-service | 8081 | Quản lý airport, airplane, flight, seat |
| passenger-service | 8082 | Quản lý hành khách |
| booking-service | 8083 | Tạo booking, kiểm tra flight/seat/passenger |
| payment-service | 8084 | Tạo & cập nhật payment |
| ticket-service | 8085 | Sinh vé điện tử |
| notification-service | 8086 | Nhận event và log thông báo |
| checkin-service | 8087 | Check-in theo ticketCode |
| user-service | 8088 | Auth, users, dashboard summary |
| postgres | 5432 | Database |
| rabbitmq | 5672 | Message broker |
| rabbitmq management | 15672 | UI quản trị RabbitMQ |
| redis | 6379 | Cache + distributed lock |
| elasticsearch | 9200 | Search engine |
| frontend dev | 5173 | React dev server |

---

## 3) Công nghệ sử dụng

- Java 17
- Quarkus 3.x
- Quarkus REST + Jackson
- Hibernate ORM with Panache
- PostgreSQL
- RabbitMQ + SmallRye Reactive Messaging
- Redis (Quarkus Redis Client)
- Elasticsearch (Quarkus Elasticsearch Java Client)
- JWT (SmallRye JWT)
- Docker + Docker Compose
- Kubernetes manifests (`k8s/`)
- Frontend: React + TypeScript + Vite + Tailwind

---

## 4) JWT + RBAC + Ownership

### Role
- `USER`: thao tác dữ liệu của chính mình.
- `ADMIN`: quản trị toàn hệ thống.

### Ownership
Hệ thống kiểm tra `userId` trong JWT so với `userId` trong dữ liệu domain:
- passenger
- booking
- payment
- ticket
- checkin

---

## 5) RabbitMQ event flow

1. `booking-service` hold seat, tạo booking `PENDING_PAYMENT`, publish `BookingCreatedEvent`
2. `payment-service` consume và tạo payment `PENDING`
3. Khi thanh toán thành công: `payment-service` publish `PaymentCompletedEvent`
4. `booking-service` consume `PaymentCompletedEvent`, chuyển booking `CONFIRMED`, confirm seat `BOOKED`
5. `ticket-service` consume `PaymentCompletedEvent`, tạo ticket với `seatNumber` thật, publish `TicketIssuedEvent`
6. Khi thanh toán thất bại: `payment-service` publish `PaymentFailedEvent`
7. `booking-service` consume `PaymentFailedEvent`, chuyển booking `CANCELLED`, release seat về `AVAILABLE`
8. `checkin-service` publish `CheckinCompletedEvent`
9. `notification-service` consume và log event

Timeout flow:
- `booking-service` có scheduler chạy mỗi `1m`.
- Booking `PENDING_PAYMENT` quá `1 phút` sẽ chuyển `EXPIRED`, release ghế.
- Đồng thời `booking-service` gọi internal API của `payment-service` để đổi payment tương ứng từ `PENDING` sang `FAILED`.

---

## 6) Docker Compose

### Chạy toàn bộ hệ thống

```bash
docker compose up --build -d
```

### Kiểm tra trạng thái

```bash
docker compose ps
```

### Dừng hệ thống

```bash
docker compose down
```

### Reset dữ liệu

```bash
docker compose down -v
```

---

## 6.1) Redis dùng cho gì?

### Flight service cache
- Cache `GET /api/airports` (TTL 10m)
- Cache `GET /api/airplanes` (TTL 10m)
- Cache `GET /api/flights` (TTL 30s)
- Cache `GET /api/flights/{id}` (TTL 60s)
- Cache `GET /api/seats/availability` (TTL 10s)

### Booking service distributed lock
- Lock key: `lock:seat:{flightId}:{seatNumber}`
- Dùng Redis `SET NX EX` để tránh đặt trùng ghế đồng thời

---

## 6.2) Elasticsearch dùng cho gì?

- `flight-service` dùng index `flights` để search chuyến bay.
- Endpoint dùng chung: `GET /api/flights/search`
- Admin gọi cùng endpoint bằng admin token để thấy full dữ liệu theo role.

---

## 7) Kubernetes deploy

```bash
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/postgres.yml
kubectl apply -f k8s/rabbitmq.yml
kubectl apply -f k8s/cloudinary-secret.yml
kubectl apply -f k8s/api-gateway.yml
kubectl apply -f k8s/flight-service.yml
kubectl apply -f k8s/passenger-service.yml
kubectl apply -f k8s/booking-service.yml
kubectl apply -f k8s/payment-service.yml
kubectl apply -f k8s/ticket-service.yml
kubectl apply -f k8s/notification-service.yml
kubectl apply -f k8s/checkin-service.yml
kubectl apply -f k8s/user-service.yml
kubectl apply -f k8s/ingress.yml
```

---

## 8) Frontend React

```bash
cd front-end
npm install
npm run dev
```

Build production:

```bash
npm run build
```

Frontend gọi API qua Gateway: `http://localhost:8080`

---

## 9) Swagger URLs

- Gateway: `http://localhost:8080/q/swagger-ui/`
- Flight: `http://localhost:8081/q/swagger-ui/`
- Passenger: `http://localhost:8082/q/swagger-ui/`
- Booking: `http://localhost:8083/q/swagger-ui/`
- Payment: `http://localhost:8084/q/swagger-ui/`
- Ticket: `http://localhost:8085/q/swagger-ui/`
- Notification: `http://localhost:8086/q/swagger-ui/`
- Checkin: `http://localhost:8087/q/swagger-ui/`
- User: `http://localhost:8088/q/swagger-ui/`

---

## 10) Danh sách API chính

### Auth/User
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users` (ADMIN)
- `GET /api/users/{id}` (ADMIN)
- `PUT /api/users/{id}` (ADMIN)
- `DELETE /api/users/{id}` (ADMIN)
- `GET /api/admin/dashboard/summary` (ADMIN)
- `GET /api/users/search?keyword=&role=` (ADMIN)

### Flight domain
- `GET /api/airports`
- `GET /api/airports/search?keyword=`
- `GET /api/airplanes`
- `GET /api/airplanes/search?keyword=`
- `GET /api/flights`
- `GET /api/flights/{id}`
- `GET /api/flights/search?keyword=&departureAirportId=&arrivalAirportId=&airplaneId=&status=&departureFrom=&departureTo=&page=&size=&sortBy=&sortDir=`
- `GET /api/seats?flightId=&seatNumber=&booked=`
- `POST /api/seats` (ADMIN)
- `PUT /api/seats/{id}` (ADMIN)
- `DELETE /api/seats/{id}` (ADMIN)
- `PUT /api/seats/{id}` (ADMIN, có thể đặt `status=BOOKED`)
- `GET /api/seats/availability`

Flight payload fields mới:
- `basePrice` (numeric): giá vé cơ bản
- `currency` (string): đơn vị tiền, mặc định `VND`

### Passenger
- `GET /api/passengers` (chỉ trả passenger chưa bị xóa mềm)
- `GET /api/passengers/me` (chỉ trả passenger chưa bị xóa mềm)
- `GET /api/passengers/{id}` (404 nếu passenger đã xóa mềm)
- `GET /api/passengers/search?keyword=` (chỉ tìm trên passenger chưa bị xóa mềm)
- `POST /api/passengers`
- `PUT /api/passengers/{id}` (USER: chỉ sửa passenger của chính mình; ADMIN bị chặn)
- `DELETE /api/passengers/{id}` (soft delete: đánh dấu `deleted=true`, không xóa vật lý)

### Booking/Payment/Ticket/Checkin
- `GET /api/bookings`
- `GET /api/bookings/me`
- `GET /api/bookings/{id}`
- `GET /api/bookings/search?bookingId=&passengerId=&flightId=&status=`
- `POST /api/bookings`
- `PUT /api/bookings/{id}/cancel`
- `GET /api/payments`
- `GET /api/payments/me`
- `GET /api/payments/booking/{bookingId}`
- `GET /api/payments/search?paymentId=&bookingId=&status=`
- `POST /api/payments/{id}/simulate-success`
- `POST /api/payments/{id}/simulate-fail`
- `PUT /api/payments/internal/booking/{bookingId}/expire` (internal service-to-service, dùng cho auto-timeout)

Payment fields mới:
- `amount` (numeric): số tiền thanh toán
- `currency` (string): đơn vị tiền, mặc định `VND`
- `paidAt` (ISO timestamp): thời điểm thanh toán thành công
- `GET /api/tickets` (ADMIN)
- `GET /api/tickets/me`
- `GET /api/tickets/code/{ticketCode}`
- `GET /api/tickets/search?ticketCode=&status=&userId=`
- `GET /api/checkins` (ADMIN)
- `GET /api/checkins/me`
- `GET /api/checkins/search?ticketCode=&status=&flightId=`
- `POST /api/checkins`

Booking status:
- `PENDING_PAYMENT`
- `CONFIRMED`
- `CANCELLED`
- `EXPIRED`

---

## 11) Cloudinary upload

- `POST /api/users/me/avatar` (USER/ADMIN)
- `POST /api/airports/{id}/image` (ADMIN)
- `POST /api/airplanes/{id}/image` (ADMIN)
- `POST /api/flights/{id}/image` (ADMIN)

Validation:
- Chỉ cho phép: `image/jpeg`, `image/png`, `image/webp`
- Max size: `5MB`

---

## 12) Hướng dẫn tạo `.env`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Sau khi đổi `.env`:

```bash
docker compose up -d --force-recreate flight-service user-service
```

---

## 13) Tài khoản admin demo

- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `ADMIN`

---

## 14) Postman testing

Đã cung cấp:
- `Airline-Booking.postman_collection.json`
- `Airline-Local.postman_environment.json`

---

## 15) Troubleshooting

1. `503 Service Unavailable` sau startup: chờ 10-20 giây.
2. Cloudinary `503`: kiểm tra `.env` và recreate service.
3. `401 Unauthorized`: kiểm tra token.
4. `403 Forbidden`: sai role.
5. `404 Not Found`: sai endpoint hoặc id không tồn tại.

---

## 16) Logs commands

```bash
docker compose logs -f api-gateway
docker compose logs -f user-service
docker compose logs -f flight-service
docker compose logs -f booking-service
docker compose logs -f payment-service
docker compose logs -f ticket-service
docker compose logs -f checkin-service
docker compose logs -f notification-service
```

---

## 17) Build backend local

```bash
mvn clean package -DskipTests
```

---

## 18) Ghi chú bảo mật

- Không commit `.env` thật lên GitHub.
- Rotate secret nếu lộ thông tin.
- Production nên dùng secret manager.

