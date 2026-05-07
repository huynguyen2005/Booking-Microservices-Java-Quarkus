# Booking Microservices Java Quarkus

Hệ thống đặt vé máy bay theo kiến trúc microservices, xây dựng bằng **Java Quarkus**, sử dụng **PostgreSQL**, **RabbitMQ**, **JWT RBAC**, hỗ trợ chạy bằng **Docker Compose** và deploy trên **Kubernetes**.

Mục tiêu dự án:
- Dễ chạy local để demo bài tập lớn.
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
| frontend dev | 5173 | React dev server |

---

## 3) Công nghệ sử dụng

- Java 17
- Quarkus 3.x
- Quarkus REST + Jackson
- Hibernate ORM with Panache
- PostgreSQL
- RabbitMQ + SmallRye Reactive Messaging
- JWT (SmallRye JWT)
- Docker + Docker Compose
- Kubernetes manifests (thư mục `k8s/`)
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

Ví dụ:
- USER không thể dùng passenger của tài khoản khác để booking.
- USER không thể xem ticket/checkin không thuộc mình.
- ADMIN được phép truy cập dữ liệu toàn hệ thống.

---

## 5) RabbitMQ event flow

Luồng bất đồng bộ chính:
1. `booking-service` publish `BookingCreatedEvent`
2. `payment-service` consume và tạo payment `PENDING`
3. Khi pay thành công: `payment-service` publish `PaymentCompletedEvent`
4. `ticket-service` consume, tạo ticket, publish `TicketIssuedEvent`
5. `checkin-service` publish `CheckinCompletedEvent`
6. `notification-service` consume tất cả event và log ra console

Lưu ý: ticket có thể xuất hiện trễ `1-3 giây` do async.

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

Thư mục frontend: `front-end/`

```bash
cd front-end
npm install
npm run dev
```

Build production:

```bash
npm run build
```

Frontend gọi API qua Gateway:
- `http://localhost:8080`

---

## 9) Swagger URLs

- Gateway: `http://localhost:8080/q/swagger-ui/` (nếu bật)
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

### Flight domain
- `GET /api/airports`
- `POST /api/airports` (ADMIN)
- `PUT /api/airports/{id}` (ADMIN)
- `DELETE /api/airports/{id}` (ADMIN)
- `GET /api/airplanes`
- `POST /api/airplanes` (ADMIN)
- `PUT /api/airplanes/{id}` (ADMIN)
- `DELETE /api/airplanes/{id}` (ADMIN)
- `GET /api/flights`
- `GET /api/flights/{id}`
- `POST /api/flights` (ADMIN)
- `GET /api/seats`
- `POST /api/seats` (ADMIN)
- `GET /api/seats/availability`

### Passenger
- `GET /api/passengers` (ADMIN)
- `GET /api/passengers/me`
- `GET /api/passengers/{id}`
- `GET /api/passengers/search?keyword=`
- `POST /api/passengers`
- `PUT /api/passengers/{id}`
- `DELETE /api/passengers/{id}`

### Booking/Payment/Ticket/Checkin
- `GET /api/bookings`
- `GET /api/bookings/me`
- `GET /api/bookings/{id}`
- `POST /api/bookings`
- `GET /api/payments`
- `GET /api/payments/me`
- `GET /api/payments/booking/{bookingId}`
- `PUT /api/payments/{id}/pay`
- `GET /api/tickets` (ADMIN)
- `GET /api/tickets/me`
- `GET /api/tickets/code/{ticketCode}`
- `GET /api/checkins` (ADMIN)
- `GET /api/checkins/me`
- `POST /api/checkins`

---

## 11) Cloudinary upload

Hệ thống hỗ trợ upload ảnh lên Cloudinary, lưu URL vào DB.

### API upload
- `POST /api/users/me/avatar` (USER/ADMIN)
- `POST /api/airports/{id}/image` (ADMIN)
- `POST /api/airplanes/{id}/image` (ADMIN)
- `POST /api/flights/{id}/image` (ADMIN)

### Validation
- Chỉ cho phép: `image/jpeg`, `image/png`, `image/webp`
- Max size: `5MB`
- Sai định dạng/kích thước: `400`
- ID không tồn tại: `404`
- USER gọi endpoint ảnh của airport/airplane/flight: `403`

---

## 12) Hướng dẫn tạo file `.env`

Tạo file `.env` ở thư mục gốc dự án:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Có thể tham chiếu từ file mẫu:
- `.env.example`

Sau khi đổi `.env`, recreate service nhận env mới:

```bash
docker compose up -d --force-recreate flight-service user-service
```

---

## 13) Tài khoản admin demo

- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `ADMIN`

Admin được seed tự động khi `user-service` startup nếu chưa tồn tại.

---

## 14) User flow demo

1. Register user
2. Login user
3. Xem flights
4. Tạo passenger
5. Tạo booking
6. Thanh toán (`pay`)
7. Xem ticket
8. Check-in
9. Logout

---

## 15) Admin flow demo

1. Login admin
2. Xem dashboard summary
3. Quản lý users
4. CRUD airports
5. CRUD airplanes
6. Quản lý flights/seats/passengers
7. Quản lý bookings/payments/tickets/checkins
8. Upload ảnh Cloudinary cho airport/airplane/flight

---

## 16) Postman testing

Đã cung cấp sẵn:
- `Airline-Booking.postman_collection.json`
- `Airline-Local.postman_environment.json`

### Import nhanh
1. Import collection + environment vào Postman
2. Chọn environment `Airline Local`
3. Chạy theo thứ tự folder:
   - Auth
   - Flight + Passenger + Booking + Payment + Ticket + Checkin
   - Cloudinary Upload

Collection có script tự động:
- Lưu `userToken`, `adminToken`
- Lưu các id: `airportId`, `airplaneId`, `flightId`, `passengerId`, `bookingId`, `paymentId`, `ticketCode`

---

## 17) Troubleshooting

1. `503 Service Unavailable` ngay sau startup
- Chờ `10-20 giây` để service healthy hoàn toàn.
- Kiểm tra: `docker compose ps`

2. Upload ảnh trả `503 Cloudinary is not configured`
- Kiểm tra `.env` có đủ 3 biến Cloudinary.
- Recreate `user-service`, `flight-service`.

3. `401 Unauthorized`
- Thiếu/sai token hoặc token hết hạn.
- Login lại, kiểm tra header `Authorization: Bearer <token>`

4. `403 Forbidden`
- Sai role (USER gọi API ADMIN).

5. `404 Not Found`
- Sai endpoint hoặc `id` không tồn tại.

6. Ticket chưa xuất hiện ngay sau pay
- Luồng async RabbitMQ, chờ `1-3 giây` rồi gọi lại.

---

## 18) Logs commands

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

RabbitMQ UI:
- `http://localhost:15672`
- User/Pass: `guest/guest`

---

## 19) Build backend local

```bash
mvn clean package -DskipTests
```

---

## 20) Ghi chú bảo mật

- Không commit `.env` thật lên GitHub.
- Rotate Cloudinary secret nếu từng lộ thông tin.
- Với production, nên dùng secret manager (K8s Secret, Vault...).
