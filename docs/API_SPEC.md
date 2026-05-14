# Backend API Specification

## 1. Tổng quan backend
- Framework: Java 17, Quarkus 3.x, RESTEasy Reactive, Hibernate ORM Panache, SmallRye JWT, SmallRye Reactive Messaging (RabbitMQ).
- Kiến trúc: Microservices + API Gateway reverse proxy.
- Base URL đề xuất cho frontend: `http://localhost:8080`.
- Gateway mapping:
  - `/api/auth`, `/api/users`, `/api/admin/dashboard` -> `user-service:8088`
  - `/api/airports`, `/api/airplanes`, `/api/flights`, `/api/seats` -> `flight-service:8081`
  - `/api/passengers` -> `passenger-service:8082`
  - `/api/bookings` -> `booking-service:8083`
  - `/api/payments` -> `payment-service:8084`
  - `/api/tickets` -> `ticket-service:8085`
  - `/api/checkins` -> `checkin-service:8087`
- Auth:
  - JWT Bearer token.
  - Issuer: `booking-microservices`.
  - Token lifespan: `3600s`.
  - Role: `USER`, `ADMIN`.
  - Ownership check theo `jwt.sub` cho passenger/booking/payment/ticket/checkin.
- Database:
  - PostgreSQL, multi-db: `flight_db`, `passenger_db`, `booking_db`, `payment_db`, `ticket_db`, `checkin_db`, `user_db`.
  - ORM generation: `quarkus.hibernate-orm.database.generation=update`.
- Bất đồng bộ:
  - RabbitMQ event flow: booking -> payment -> ticket -> notification.

## 2. Auth flow (JWT)

1. `POST /api/auth/login` để lấy token.
2. Frontend lưu token (memory + persisted storage tùy chiến lược).
3. Gửi header cho API cần auth:

```http
Authorization: Bearer <JWT>
```

4. Backend xác thực token + role + ownership.
5. Khi token hết hạn hoặc lỗi: backend trả `401/403`, frontend cần logout hoặc refresh flow (hiện backend chưa có refresh token endpoint).

## 3. Chuẩn response/lỗi thực tế
- Success: trả JSON entity/record hoặc primitive (`boolean`) tùy endpoint.
- Error: nhiều endpoint trả plain text message hoặc default error body của Quarkus.
- Gợi ý frontend: chuẩn hóa tầng API client để map lỗi về format nội bộ.

Ví dụ lỗi thường gặp:

```json
"Email already exists"
```

```json
"Passenger does not belong to current user"
```

```json
"Seat not available"
```

## 4. Danh sách API tổng hợp

| STT | Chức năng | Method | Endpoint | Auth | Role | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Gateway home | GET | `/` | No | Public | Kiểm tra gateway |
| 2 | Register | POST | `/api/auth/register` | No | Public | Đăng ký user |
| 3 | Login | POST | `/api/auth/login` | No | Public | Đăng nhập lấy token |
| 4 | Me | GET | `/api/auth/me` | Yes | USER/ADMIN | Thông tin user hiện tại |
| 5 | Upload avatar | POST | `/api/users/me/avatar` | Yes | USER/ADMIN | Upload ảnh đại diện |
| 6 | Dashboard summary | GET | `/api/admin/dashboard/summary` | Yes | ADMIN | Thống kê hệ thống |
| 7 | Users list | GET | `/api/users` | Yes | ADMIN | Danh sách user |
| 8 | User detail | GET | `/api/users/{id}` | Yes | ADMIN | Chi tiết user |
| 9 | User update | PUT | `/api/users/{id}` | Yes | ADMIN | Cập nhật user |
| 10 | User delete | DELETE | `/api/users/{id}` | Yes | ADMIN | Xóa user |
| 11 | Airports list | GET | `/api/airports` | No | Public | Danh sách sân bay |
| 12 | Airport create | POST | `/api/airports` | Yes | ADMIN | Tạo sân bay |
| 13 | Airport update | PUT | `/api/airports/{id}` | Yes | ADMIN | Sửa sân bay |
| 14 | Airport image | POST | `/api/airports/{id}/image` | Yes | ADMIN | Upload ảnh sân bay |
| 15 | Airport delete | DELETE | `/api/airports/{id}` | Yes | ADMIN | Xóa sân bay |
| 16 | Airplanes list | GET | `/api/airplanes` | Yes | USER/ADMIN | Danh sách máy bay |
| 17 | Airplane create | POST | `/api/airplanes` | Yes | ADMIN | Tạo máy bay |
| 18 | Airplane update | PUT | `/api/airplanes/{id}` | Yes | ADMIN | Sửa máy bay |
| 19 | Airplane image | POST | `/api/airplanes/{id}/image` | Yes | ADMIN | Upload ảnh máy bay |
| 20 | Airplane delete | DELETE | `/api/airplanes/{id}` | Yes | ADMIN | Xóa máy bay |
| 21 | Flights list | GET | `/api/flights` | No | Public | Danh sách chuyến bay |
| 22 | Flight detail | GET | `/api/flights/{id}` | No | Public | Chi tiết chuyến bay |
| 23 | Flight create | POST | `/api/flights` | Yes | ADMIN | Tạo chuyến bay |
| 24 | Flight image | POST | `/api/flights/{id}/image` | Yes | ADMIN | Upload ảnh chuyến bay |
| 25 | Seats list | GET | `/api/seats` | Yes | USER/ADMIN | Danh sách ghế, có filter |
| 26 | Seat create | POST | `/api/seats` | Yes | ADMIN | Tạo ghế |
| 27 | Seat availability | GET | `/api/seats/availability` | Yes | USER/ADMIN | Kiểm tra ghế trống |
| 28 | Seat book | PUT | `/api/seats/{id}/book` | Yes | ADMIN | Đánh dấu ghế đã đặt |
| 29 | Passengers list | GET | `/api/passengers` | Yes | ADMIN | Toàn bộ passenger |
| 30 | My passengers | GET | `/api/passengers/me` | Yes | USER/ADMIN | Passenger của tôi |
| 31 | Passenger search | GET | `/api/passengers/search` | Yes | USER/ADMIN | Tìm kiếm passenger |
| 32 | Passenger detail | GET | `/api/passengers/{id}` | Yes | USER/ADMIN | Chi tiết passenger |
| 33 | Passenger create | POST | `/api/passengers` | Yes | USER/ADMIN | Tạo passenger |
| 34 | Passenger update | PUT | `/api/passengers/{id}` | Yes | USER/ADMIN | Sửa passenger |
| 35 | Passenger delete | DELETE | `/api/passengers/{id}` | Yes | USER/ADMIN | Xóa passenger |
| 36 | Bookings list | GET | `/api/bookings` | Yes | ADMIN | Toàn bộ booking |
| 37 | My bookings | GET | `/api/bookings/me` | Yes | USER/ADMIN | Booking của tôi |
| 38 | Booking detail | GET | `/api/bookings/{id}` | Yes | USER/ADMIN | Chi tiết booking |
| 39 | Booking create | POST | `/api/bookings` | Yes | USER/ADMIN | Tạo booking |
| 40 | Payments list | GET | `/api/payments` | Yes | ADMIN | Toàn bộ payment |
| 41 | My payments | GET | `/api/payments/me` | Yes | USER/ADMIN | Payment của tôi |
| 42 | Payment by booking | GET | `/api/payments/booking/{bookingId}` | Yes | USER/ADMIN | Payment theo booking |
| 43 | Pay payment | PUT | `/api/payments/{id}/pay` | Yes | USER/ADMIN | Thanh toán thành công |
| 44 | Fail payment | PUT | `/api/payments/{id}/fail` | Yes | ADMIN | Đánh dấu thất bại |
| 45 | Tickets list | GET | `/api/tickets` | Yes | ADMIN | Toàn bộ ticket |
| 46 | My tickets | GET | `/api/tickets/me` | Yes | USER/ADMIN | Ticket của tôi |
| 47 | Tickets by booking | GET | `/api/tickets/booking/{bookingId}` | Yes | USER/ADMIN | Ticket theo booking |
| 48 | Tickets by passenger | GET | `/api/tickets/passenger/{passengerId}` | Yes | USER/ADMIN | Ticket theo passenger |
| 49 | Ticket by code | GET | `/api/tickets/code/{ticketCode}` | Yes | USER/ADMIN | Ticket theo mã |
| 50 | Checkins list | GET | `/api/checkins` | Yes | ADMIN | Toàn bộ checkin |
| 51 | My checkins | GET | `/api/checkins/me` | Yes | USER/ADMIN | Checkin của tôi |
| 52 | Checkin create | POST | `/api/checkins` | Yes | USER/ADMIN | Check-in bằng ticketCode |
| 53 | Checkin by ticket | GET | `/api/checkins/ticket/{ticketCode}` | Yes | USER/ADMIN | Checkin theo ticketCode |

## 5. Data model cho frontend

### 5.1 AppUser / Auth
| Field | Type | Required | Ghi chú |
|---|---|---|---|
| id | number | yes (response) | PK |
| fullName | string | yes | |
| email | string | yes | unique |
| phone | string | optional | nullable |
| avatarUrl | string | optional | nullable |
| role | enum(`ADMIN`,`USER`) | yes | |
| createdAt | string (ISO datetime) | yes (response) | `Instant` |

### 5.2 Passenger
| Field | Type | Required | Ghi chú |
|---|---|---|---|
| id | number | response | PK |
| userId | number | create: backend tự set cho USER | owner |
| fullName | string | business-required (khuyên bắt buộc UI) | backend chưa validate cứng |
| email | string | optional | |
| phone | string | optional | |
| passportNumber | string | optional | dùng search |

### 5.3 Flight domain

**Airport**: `id, code, name, city, imageUrl`  
**Airplane**: `id, code, model, totalSeats, imageUrl`  
**Flight**: `id, departureAirportId, arrivalAirportId, airplaneId, flightNumber, departureTime, arrivalTime, status, imageUrl`  
**Seat**: `id, flightId, seatNumber, booked:boolean`

### 5.4 Booking/Payment/Ticket/Checkin
| Model | Field chính |
|---|---|
| Booking | `id,userId,passengerId,flightId,seatNumber,status` |
| Payment | `id,userId,bookingId,passengerId,flightId,status` |
| Ticket | `id,userId,ticketCode,bookingId,passengerId,flightId,seatNumber,status` |
| Checkin | `id,userId,ticketCode,status,bookingId,passengerId,flightId` |

### 5.5 Status/enum
- Role: `ADMIN`, `USER`
- Booking.status: `CREATED`
- Payment.status: `PENDING`, `PAID`, `FAILED`
- Ticket.status: thường là `ISSUED`
- Checkin.status: `CHECKED_IN`

## 6. Chi tiết từng nhóm API

### 6.1 Auth APIs

#### API: Register
- Method: `POST`
- Endpoint: `/api/auth/register`
- Auth: No
- Mô tả: Tạo tài khoản USER mới.

Request body:
```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "password": "secret123",
  "phone": "0901234567"
}
```

Success `201`:
```json
{
  "id": 2,
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "0901234567",
  "avatarUrl": null,
  "role": "USER",
  "createdAt": "2026-05-09T06:25:30.000Z"
}
```

Error:
- `400`: `"fullName, email and password are required"`
- `409`: `"Email already exists"`

#### API: Login
- Method: `POST`
- Endpoint: `/api/auth/login`
- Auth: No

Request:
```json
{
  "email": "a@example.com",
  "password": "secret123"
}
```

Success `200`:
```json
{
  "token": "<jwt>",
  "user": {
    "id": 2,
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "role": "USER"
  }
}
```

Error:
- `400`: `"Email and password are required"`
- `401`: `"Invalid credentials"`

#### API: Me
- Method: `GET`
- Endpoint: `/api/auth/me`
- Auth: Yes
- Role: `USER`/`ADMIN`

Headers:
```http
Authorization: Bearer <jwt>
```

Success `200`: `UserResponse`

### 6.2 User profile/admin APIs

#### API: Upload avatar
- Method: `POST`
- Endpoint: `/api/users/me/avatar`
- Auth: Yes
- Role: `USER`/`ADMIN`
- Content-Type: `multipart/form-data`

Form-data:
- `file` (required)

Success `200`:
```json
{
  "imageUrl": "https://res.cloudinary.com/.../avatar.jpg"
}
```

Error:
- `400`: `"file is required" | "Unsupported file type" | "File size exceeds 5MB" | "Cannot read upload file"`

#### API: Admin users CRUD
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- Auth: Yes, Role: `ADMIN`

Update body example:
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "phone": "0900000000",
  "password": "newpass",
  "role": "ADMIN"
}
```

### 6.3 Admin dashboard API

#### API: Summary
- Method: `GET`
- Endpoint: `/api/admin/dashboard/summary`
- Auth: Yes
- Role: `ADMIN`

Success `200`:
```json
{
  "usersTotal": 10,
  "adminUsersTotal": 1,
  "airportsTotal": 4,
  "airplanesTotal": 3,
  "flightsTotal": 12,
  "seatsTotal": 480,
  "passengersTotal": 8,
  "bookingsTotal": 7,
  "paymentsTotal": 7,
  "pendingPaymentsTotal": 2,
  "paidPaymentsTotal": 4,
  "failedPaymentsTotal": 1,
  "ticketsTotal": 4,
  "checkinsTotal": 2
}
```

### 6.4 Flight domain APIs

#### Airport CRUD
- `GET /api/airports` (Public)
- `POST /api/airports` (ADMIN)
- `PUT /api/airports/{id}` (ADMIN)
- `DELETE /api/airports/{id}` (ADMIN)
- `POST /api/airports/{id}/image` (ADMIN, multipart)

Airport JSON:
```json
{
  "id": 1,
  "code": "SGN",
  "name": "Tan Son Nhat",
  "city": "Ho Chi Minh",
  "imageUrl": "https://..."
}
```

#### Airplane CRUD
- `GET /api/airplanes` (USER/ADMIN)
- `POST /api/airplanes` (ADMIN)
- `PUT /api/airplanes/{id}` (ADMIN)
- `DELETE /api/airplanes/{id}` (ADMIN)
- `POST /api/airplanes/{id}/image` (ADMIN, multipart)

Airplane JSON:
```json
{
  "id": 1,
  "code": "VN-A123",
  "model": "Airbus A321",
  "totalSeats": 180,
  "imageUrl": "https://..."
}
```

#### Flight CRUD (partial)
- `GET /api/flights` (Public)
- `GET /api/flights/{id}` (Public)
- `POST /api/flights` (ADMIN)
- `POST /api/flights/{id}/image` (ADMIN, multipart)

Flight JSON:
```json
{
  "id": 1,
  "departureAirportId": 1,
  "arrivalAirportId": 2,
  "airplaneId": 1,
  "flightNumber": "VN123",
  "departureTime": "2026-05-10T08:00:00+07:00",
  "arrivalTime": "2026-05-10T10:00:00+07:00",
  "status": "SCHEDULED",
  "imageUrl": "https://..."
}
```

#### Seat APIs
- `GET /api/seats?flightId={id}` (USER/ADMIN) -> filter theo `flightId` nếu có.
- `POST /api/seats` (ADMIN)
- `GET /api/seats/availability?flightId={id}&seatNumber={code}` (USER/ADMIN) -> `boolean`
- `PUT /api/seats/{id}/book` (ADMIN)

Seat JSON:
```json
{
  "id": 1,
  "flightId": 1,
  "seatNumber": "A1",
  "booked": false
}
```

### 6.5 Passenger APIs

- `GET /api/passengers` (ADMIN)
- `GET /api/passengers/me` (USER/ADMIN)
- `GET /api/passengers/search?keyword=...` (USER/ADMIN)
- `GET /api/passengers/{id}` (USER/ADMIN)
- `POST /api/passengers` (USER/ADMIN)
- `PUT /api/passengers/{id}` (USER/ADMIN)
- `DELETE /api/passengers/{id}` (USER/ADMIN)

Passenger body example:
```json
{
  "userId": 2,
  "fullName": "Tran Thi B",
  "email": "b@example.com",
  "phone": "0911222333",
  "passportNumber": "P1234567"
}
```

Nghiệp vụ ownership:
- USER: chỉ thao tác passenger có `userId = jwt.sub`.
- ADMIN: xem/sửa/xóa tất cả, create có thể gán `userId` khác.

### 6.6 Booking APIs

- `GET /api/bookings` (ADMIN)
- `GET /api/bookings/me` (USER/ADMIN)
- `GET /api/bookings/{id}` (USER/ADMIN)
- `POST /api/bookings` (USER/ADMIN)

Create request:
```json
{
  "passengerId": 10,
  "flightId": 3,
  "seatNumber": "A1"
}
```

Success `200`:
```json
{
  "id": 100,
  "userId": 2,
  "passengerId": 10,
  "flightId": 3,
  "seatNumber": "A1",
  "status": "CREATED"
}
```

Error:
- `400`: `Passenger not found`, `Flight not found`, `Seat not available`
- `403`: `Passenger does not belong to current user`, `Not your booking`
- `404`: `Booking not found`

### 6.7 Payment APIs

- `GET /api/payments` (ADMIN)
- `GET /api/payments/me` (USER/ADMIN)
- `GET /api/payments/booking/{bookingId}` (USER/ADMIN)
- `PUT /api/payments/{id}/pay` (USER/ADMIN)
- `PUT /api/payments/{id}/fail` (ADMIN)

Payment JSON:
```json
{
  "id": 200,
  "userId": 2,
  "bookingId": 100,
  "passengerId": 10,
  "flightId": 3,
  "status": "PENDING"
}
```

Pay success -> `status = PAID`.
Fail success -> `status = FAILED`.

### 6.8 Ticket APIs

- `GET /api/tickets` (ADMIN)
- `GET /api/tickets/me` (USER/ADMIN)
- `GET /api/tickets/booking/{bookingId}` (USER/ADMIN)
- `GET /api/tickets/passenger/{passengerId}` (USER/ADMIN)
- `GET /api/tickets/code/{ticketCode}` (USER/ADMIN)

Ticket JSON:
```json
{
  "id": 300,
  "userId": 2,
  "ticketCode": "TCK-20260509-ABCD",
  "bookingId": 100,
  "passengerId": 10,
  "flightId": 3,
  "seatNumber": "A1",
  "status": "ISSUED"
}
```

### 6.9 Checkin APIs

- `GET /api/checkins` (ADMIN)
- `GET /api/checkins/me` (USER/ADMIN)
- `POST /api/checkins` (USER/ADMIN)
- `GET /api/checkins/ticket/{ticketCode}` (USER/ADMIN)

Create request:
```json
{
  "ticketCode": "TCK-20260509-ABCD"
}
```

Success:
```json
{
  "id": 400,
  "userId": 2,
  "ticketCode": "TCK-20260509-ABCD",
  "status": "CHECKED_IN",
  "bookingId": 100,
  "passengerId": 10,
  "flightId": 3
}
```

Error:
- `400`: `Ticket not found`
- `403`: `Not your ticket`, `Not your checkin`
- `404`: `Checkin not found`

## 7. Search/filter/sort/pagination support

- Search:
  - `GET /api/passengers/search?keyword=...` (contains, case-insensitive trên `fullName`, `email`, `passportNumber`).
- Filter:
  - `GET /api/seats?flightId=...`.
  - `GET /api/seats/availability?flightId=...&seatNumber=...`.
  - `/api/tickets/booking/{bookingId}`, `/api/tickets/passenger/{passengerId}`.
  - `/api/payments/booking/{bookingId}`.
- Sort:
  - Chưa có query sort ở backend.
- Pagination:
  - Chưa có pagination backend; các list endpoint trả toàn bộ bản ghi phù hợp điều kiện.

## 8. Ghi chú tích hợp frontend quan trọng

- Hầu hết endpoint yêu cầu auth; trừ register/login/home gateway.
- Không có refresh token endpoint.
- Một số endpoint có thể trả `null` với mã `200` (`GET /api/flights/{id}`, `PUT /api/seats/{id}/book`) khi id không tồn tại; frontend nên tự guard null.
- Luồng ticket/checkin phụ thuộc async event, sau khi pay nên polling `tickets` trong vài giây.
- Upload ảnh cần `multipart/form-data` với key `file`.
