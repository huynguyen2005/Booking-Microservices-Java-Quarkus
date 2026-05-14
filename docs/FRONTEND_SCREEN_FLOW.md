# Frontend Screen Flow

## 1. Mục tiêu tài liệu
Tài liệu này mô tả:
- User flow và admin flow.
- Danh sách màn hình cần xây dựng.
- Mapping từng màn hình với API backend.
- Field form, button action, dữ liệu table/list.
- Search/filter/sort/pagination theo khả năng backend hiện có.

## 2. Global app flow

### 2.1 Public flow
1. Vào app -> Trang chủ hiển thị form tìm kiếm và danh sách chuyến bay (không yêu cầu login).
2. User có thể sang `Register`.
3. Login thành công -> lưu token + profile tóm tắt.
4. Điều hướng theo role:
- `USER` -> user area.
- `ADMIN` -> admin dashboard.

### 2.2 Auth guard flow
- Mọi route private cần token.
- Nếu API trả `401/403`:
  - clear auth state
  - redirect về `/login`
  - hiển thị thông báo phiên đăng nhập hết hạn/không có quyền.

## 3. Danh sách pages đề xuất

| Page | Path gợi ý | Role | Mục đích |
|---|---|---|---|
| Login | `/login` | Public | Đăng nhập |
| Register | `/register` | Public | Đăng ký |
| Home flights | `/flights` | Public | Xem chuyến bay (E-commerce UI) |
| Flight detail | `/flights/:id` | Public | Xem flight (bấm Book -> cần login) |
| My profile | `/profile` | USER/ADMIN | Xem me + upload avatar |
| My passengers | `/my-passengers` | USER/ADMIN | CRUD passenger của user |
| My bookings | `/my-bookings` | USER/ADMIN | Danh sách booking |
| Create booking | `/bookings/new` | USER/ADMIN | Tạo booking |
| My payments | `/my-payments` | USER/ADMIN | Xem payment + pay |
| My tickets | `/my-tickets` | USER/ADMIN | Xem ticket |
| Check-in | `/checkin` | USER/ADMIN | Checkin theo ticketCode |
| Admin dashboard | `/admin/dashboard` | ADMIN | Tổng quan số liệu |
| Admin users | `/admin/users` | ADMIN | Quản lý user |
| Admin airports | `/admin/airports` | ADMIN | CRUD airport |
| Admin airplanes | `/admin/airplanes` | ADMIN | CRUD airplane |
| Admin flights | `/admin/flights` | ADMIN | CRUD flight |
| Admin seats | `/admin/seats` | ADMIN | Quản lý seat |
| Admin passengers | `/admin/passengers` | ADMIN | Xem/tìm/sửa passenger |
| Admin bookings | `/admin/bookings` | ADMIN | Xem booking |
| Admin payments | `/admin/payments` | ADMIN | Xem/pay/fail payment |
| Admin tickets | `/admin/tickets` | ADMIN | Xem/tra cứu ticket |
| Admin checkins | `/admin/checkins` | ADMIN | Xem checkin |

## 4. API mapping theo page

## 4.1 Login page
- APIs:
  - `POST /api/auth/login`
- Form fields:
  - `email` (required)
  - `password` (required)
- Buttons:
  - `Login` -> gọi login.
  - `Go Register` -> chuyển trang register.
- Thành công:
  - lưu `token`, `user`
  - điều hướng theo role.

Request mẫu:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

## 4.2 Register page
- APIs:
  - `POST /api/auth/register`
- Form fields:
  - `fullName` required
  - `email` required
  - `password` required
  - `phone` optional
- Button:
  - `Register` -> gọi API, success về login.

## 4.3 Profile page
- APIs:
  - `GET /api/auth/me`
  - `POST /api/users/me/avatar` (multipart)
- Display fields:
  - fullName, email, phone, role, createdAt, avatarUrl
- Form upload:
  - `file` (image jpeg/png/webp, <=5MB)

## 4.4 Flights list/detail
- APIs list:
  - `GET /api/flights`
  - `GET /api/airports`
  - `GET /api/airplanes`
- APIs detail:
  - `GET /api/flights/{id}`
  - `GET /api/seats?flightId={id}`
  - `GET /api/seats/availability?flightId={id}&seatNumber={seatNo}`
- Table/list fields flights:
  - flightNumber, departureAirportId, arrivalAirportId, departureTime, arrivalTime, status, imageUrl
- Filter/search:
  - backend chưa hỗ trợ search flight; filter frontend local.

## 4.5 My passengers
- APIs:
  - `GET /api/passengers/me`
  - `POST /api/passengers`
  - `PUT /api/passengers/{id}`
  - `DELETE /api/passengers/{id}`
  - `GET /api/passengers/search?keyword=...`
- Form fields:
  - fullName (nên required ở UI)
  - email
  - phone
  - passportNumber
- Table fields:
  - fullName, email, phone, passportNumber
- Search:
  - dùng `keyword` backend.

## 4.6 Create booking
- APIs:
  - `GET /api/passengers/me` (dropdown passenger)
  - `GET /api/flights` (dropdown flight)
  - `GET /api/seats/availability` (validate seat)
  - `POST /api/bookings`
- Form fields:
  - passengerId required
  - flightId required
  - seatNumber required
- Button:
  - `Create Booking` -> gọi API.

Request mẫu:
```json
{
  "passengerId": 10,
  "flightId": 3,
  "seatNumber": "A1"
}
```

## 4.7 My bookings
- API: `GET /api/bookings/me`
- Table fields:
  - id, passengerId, flightId, seatNumber, status
- Actions:
  - `View payment` theo bookingId.

## 4.8 My payments
- APIs:
  - `GET /api/payments/me`
  - `GET /api/payments/booking/{bookingId}`
  - `PUT /api/payments/{id}/pay`
- Table fields:
  - id, bookingId, passengerId, flightId, status
- Button:
  - `Pay` (hiển thị khi status=PENDING)

## 4.9 My tickets
- APIs:
  - `GET /api/tickets/me`
  - `GET /api/tickets/code/{ticketCode}`
  - `GET /api/tickets/booking/{bookingId}` (tùy màn hình)
- Table fields:
  - ticketCode, bookingId, passengerId, flightId, seatNumber, status
- Nghiệp vụ async:
  - sau pay, polling tickets mỗi 1-2 giây tối đa 10 lần.

## 4.10 Check-in page
- APIs:
  - `POST /api/checkins`
  - `GET /api/checkins/me`
  - `GET /api/checkins/ticket/{ticketCode}`
- Form fields:
  - ticketCode required
- Table fields:
  - ticketCode, bookingId, passengerId, flightId, status

## 4.11 Admin dashboard
- API: `GET /api/admin/dashboard/summary`
- Widgets:
  - usersTotal, flightsTotal, bookingsTotal, paymentsTotal, paid/failed/pending, ticketsTotal, checkinsTotal

## 4.12 Admin users
- APIs: `GET /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`
- Table fields:
  - id, fullName, email, phone, role, createdAt
- Form edit:
  - fullName, email, phone, password, role

## 4.13 Admin airports/airplanes/flights/seats
- Airports:
  - `GET/POST/PUT/DELETE /api/airports`
  - `POST /api/airports/{id}/image`
- Airplanes:
  - `GET/POST/PUT/DELETE /api/airplanes`
  - `POST /api/airplanes/{id}/image`
- Flights:
  - `GET /api/flights`, `POST /api/flights`, `POST /api/flights/{id}/image`
- Seats:
  - `GET /api/seats`, `POST /api/seats`, `PUT /api/seats/{id}/book`

## 4.14 Admin operations pages
- Passengers:
  - `GET /api/passengers`
  - `GET /api/passengers/search?keyword=...`
- Bookings:
  - `GET /api/bookings`
- Payments:
  - `GET /api/payments`, `PUT /api/payments/{id}/pay`, `PUT /api/payments/{id}/fail`
- Tickets:
  - `GET /api/tickets`, `GET /api/tickets/code/{ticketCode}`
- Checkins:
  - `GET /api/checkins`

## 5. Pagination / filter / sort / search

- Pagination backend: chưa hỗ trợ.
  - Chiến lược frontend: client-side pagination (DataGrid/Table).
- Sort backend: chưa hỗ trợ.
  - Chiến lược frontend: client-side sort.
- Search backend:
  - `GET /api/passengers/search?keyword=...`
- Filter backend:
  - `GET /api/seats?flightId=...`
  - `GET /api/seats/availability?flightId=...&seatNumber=...`
  - `GET /api/payments/booking/{bookingId}`
  - `GET /api/tickets/booking/{bookingId}`
  - `GET /api/tickets/passenger/{passengerId}`

## 6. UI state handling khuyến nghị
- Loading state: cho mọi request.
- Empty state: list APIs có thể trả mảng rỗng.
- Error state:
  - map 400 -> lỗi nhập liệu/nghiệp vụ
  - 401 -> yêu cầu login lại
  - 403 -> không có quyền/không ownership
  - 404 -> không tìm thấy
- Retry strategy:
  - payment->ticket async: polling ticket list/code.

## 7. Route guard đề xuất
- Public routes: `/login`, `/register`
- Private USER/ADMIN: toàn bộ route user domain.
- Admin-only: `/admin/**`
- Guard theo `user.role` từ login/me.

## 8. API client structure đề xuất
- `authApi`: login/register/me
- `userApi`: users admin + avatar
- `flightApi`: airports/airplanes/flights/seats
- `passengerApi`
- `bookingApi`
- `paymentApi`
- `ticketApi`
- `checkinApi`
- `http.ts`: interceptor gắn token + xử lý lỗi 401/403
