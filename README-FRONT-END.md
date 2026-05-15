# README Front-End

Tài liệu này dành cho dev front-end triển khai đầy đủ UI theo chức năng backend hiện có.

Base API qua gateway:
- `http://localhost:8080`

Auth:
- Bearer JWT trong header `Authorization: Bearer <token>`
- Role: `USER`, `ADMIN`

## 1. Public (chưa đăng nhập)

### 1.1 Auth
- Đăng ký: `POST /api/auth/register`
- Đăng nhập: `POST /api/auth/login`

### 1.2 Xem dữ liệu chuyến bay
- Airports: `GET /api/airports`, `GET /api/airports/search?keyword=`
- Airplanes: `GET /api/airplanes`, `GET /api/airplanes/search?keyword=`
- Flights: `GET /api/flights`, `GET /api/flights/{id}`
- Flight search: `GET /api/flights/search?keyword=&departureAirportId=&arrivalAirportId=&airplaneId=&status=&departureFrom=&departureTo=&page=&size=&sortBy=&sortDir=`

Field mới cần hiển thị:
- `Flight.basePrice` (giá cơ bản)
- `Flight.currency` (mặc định `VND`)

## 2. USER Features

### 2.1 Hồ sơ người dùng
- Xem thông tin hiện tại: `GET /api/auth/me`
- Upload avatar: `POST /api/users/me/avatar` (multipart, key `file`)

### 2.2 Quản lý Passenger (của chính user)
- Danh sách của tôi: `GET /api/passengers/me`
- Chi tiết: `GET /api/passengers/{id}`
- Tìm kiếm: `GET /api/passengers/search?keyword=`
- Tạo: `POST /api/passengers`
- Cập nhật: `PUT /api/passengers/{id}`
- Xóa: `DELETE /api/passengers/{id}`

### 2.3 Ghế/chuyến bay để đặt vé
- Danh sách ghế: `GET /api/seats?flightId=&seatNumber=&booked=`
- Kiểm tra ghế trống: `GET /api/seats/availability?flightId=&seatNumber=`

### 2.4 Booking
- Tạo booking: `POST /api/bookings`
- Booking của tôi: `GET /api/bookings/me`
- Chi tiết booking: `GET /api/bookings/{id}`
- Search booking: `GET /api/bookings/search?bookingId=&passengerId=&flightId=&status=`
- Hủy booking: `PUT /api/bookings/{id}/cancel`

Lưu ý nghiệp vụ:
- Chỉ đặt được khi flight status là `SCHEDULED`.
- Passenger phải thuộc user hiện tại.

### 2.5 Payment
- Payment của tôi: `GET /api/payments/me`
- Payment theo booking: `GET /api/payments/booking/{bookingId}`
- Search payment: `GET /api/payments/search?paymentId=&bookingId=&status=`
- Giả lập thanh toán thành công: `POST /api/payments/{id}/simulate-success`
- Giả lập thanh toán thất bại: `POST /api/payments/{id}/simulate-fail`

Lưu ý trạng thái timeout:
- Booking `PENDING_PAYMENT` quá 1 phút sẽ tự chuyển `EXPIRED`.
- Payment liên quan sẽ tự chuyển `FAILED`.
- UI trang payment chỉ cho thao tác khi `payment=PENDING` và `booking=PENDING_PAYMENT`.

Field mới cần hiển thị:
- `Payment.amount` (số tiền)
- `Payment.currency` (mặc định `VND`)
- `Payment.paidAt` (thời điểm thanh toán thành công)

### 2.6 Ticket
- Vé của tôi: `GET /api/tickets/me`
- Tra vé theo mã: `GET /api/tickets/code/{ticketCode}`
- Search ticket: `GET /api/tickets/search?ticketCode=&status=&userId=`

### 2.7 Check-in
- Check-in theo mã vé: `POST /api/checkins`
- Lịch sử check-in của tôi: `GET /api/checkins/me`
- Check-in theo ticketCode: `GET /api/checkins/ticket/{ticketCode}`
- Search check-in: `GET /api/checkins/search?ticketCode=&status=&flightId=`

## 3. ADMIN Features

ADMIN có toàn bộ quyền USER + các trang quản trị sau:

### 3.1 Dashboard
- Tổng quan hệ thống: `GET /api/admin/dashboard/summary`

### 3.2 User Management
- Danh sách user: `GET /api/users`
- Chi tiết user: `GET /api/users/{id}`
- Cập nhật user: `PUT /api/users/{id}`
- Xóa user: `DELETE /api/users/{id}`
- Search user: `GET /api/users/search?keyword=&role=`

### 3.3 Airport Management
- Tạo: `POST /api/airports`
- Cập nhật: `PUT /api/airports/{id}`
- Xóa: `DELETE /api/airports/{id}`
- Upload ảnh: `POST /api/airports/{id}/image`

### 3.4 Airplane Management
- Tạo: `POST /api/airplanes`
- Cập nhật: `PUT /api/airplanes/{id}`
- Xóa: `DELETE /api/airplanes/{id}`
- Upload ảnh: `POST /api/airplanes/{id}/image`

### 3.5 Flight Management
- Tạo: `POST /api/flights`
- Cập nhật: `PUT /api/flights/{id}`
- Xóa: `DELETE /api/flights/{id}`
- Upload ảnh: `POST /api/flights/{id}/image`

Payload khuyến nghị khi tạo/cập nhật Flight:
```json
{
  "departureAirportId": 1,
  "arrivalAirportId": 2,
  "airplaneId": 1,
  "flightNumber": "VN100",
  "departureTime": "2026-05-07T10:00:00",
  "arrivalTime": "2026-05-07T12:00:00",
  "status": "SCHEDULED",
  "basePrice": 1500000,
  "currency": "VND"
}
```

### 3.6 Seat Management
- Tạo ghế: `POST /api/seats`
- Book ghế thủ công: `PUT /api/seats/{id}/book`

### 3.7 Booking/Payment/Ticket/Checkin Admin Views
- Bookings toàn hệ thống: `GET /api/bookings`
- Payments toàn hệ thống: `GET /api/payments`
- Đánh dấu fail payment (admin): `PUT /api/payments/{id}/fail`
- Tickets toàn hệ thống: `GET /api/tickets`
- Checkins toàn hệ thống: `GET /api/checkins`

## 4. Gợi ý route UI

### 4.1 Public
- `/login`
- `/register`
- `/flights`
- `/flights/:id`

### 4.2 USER
- `/profile`
- `/my-passengers`
- `/bookings/new`
- `/my-bookings`
- `/my-payments`
- `/my-tickets`
- `/checkin`

### 4.3 ADMIN
- `/admin/dashboard`
- `/admin/users`
- `/admin/airports`
- `/admin/airplanes`
- `/admin/flights`
- `/admin/seats`
- `/admin/passengers`
- `/admin/bookings`
- `/admin/payments`
- `/admin/tickets`
- `/admin/checkins`

## 5. Trạng thái nghiệp vụ cần hiển thị

- Booking: `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `EXPIRED`
- Payment: `PENDING`, `PAID`, `FAILED`
- Ticket: `ISSUED`
- Checkin: `CHECKED_IN`
- Seat: `AVAILABLE`, `HELD`, `BOOKED`

## 6. Lưu ý triển khai front-end

- Tách layout theo role `USER`/`ADMIN`.
- Khi payment success/fail, nên refresh/poll booking + ticket vài giây do flow async qua RabbitMQ.
- Với lỗi backend, ưu tiên hiển thị message trả về (plain text hoặc JSON message).
- Upload ảnh dùng multipart/form-data, giới hạn file ảnh hợp lệ (`jpeg/png/webp`, <= 5MB).
