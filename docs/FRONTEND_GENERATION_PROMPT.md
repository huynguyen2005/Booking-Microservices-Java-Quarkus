# FRONTEND_GENERATION_PROMPT

Bạn là Senior Frontend Engineer.
Hãy tạo frontend production-ready cho hệ thống Airline Booking microservices.

## 1) Tech stack bắt buộc
- React + TypeScript + Vite
- Router: React Router
- State/data fetching: TanStack Query
- Form: React Hook Form + Zod
- HTTP client: Axios
- UI: ưu tiên component library hiện đại (MUI/Antd/Shadcn đều được, nhưng phải nhất quán)
- Table: hỗ trợ sort/filter/pagination client-side
- Toast notification + loading skeleton + error boundary

## 2) Backend base URL
- Base URL: `http://localhost:8080`
- Tất cả API gọi qua gateway.

## 3) Auth/JWT requirements
- Login API: `POST /api/auth/login`
- Register API: `POST /api/auth/register`
- Me API: `GET /api/auth/me`
- Lưu token JWT, tự động gắn header:
  - `Authorization: Bearer <token>`
- Có route guard:
  - Public: login, register, danh sách chuyến bay (/flights), chi tiết chuyến bay (/flights/:id)
  - Private: tạo booking, thanh toán, quản lý vé và profile cá nhân
  - Admin-only: `/admin/**`
- Khi gặp `401/403` thì logout và redirect login (có thông báo).

## 4) Domain models

### UserResponse
```ts
type Role = 'ADMIN' | 'USER';

type UserResponse = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: string; // ISO datetime
};
```

### Passenger
```ts
type Passenger = {
  id: number;
  userId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  passportNumber: string | null;
};
```

### Airport / Airplane / Flight / Seat
```ts
type Airport = { id: number; code: string | null; name: string | null; city: string | null; imageUrl: string | null; };
type Airplane = { id: number; code: string | null; model: string | null; totalSeats: number; imageUrl: string | null; };
type Flight = {
  id: number;
  departureAirportId: number | null;
  arrivalAirportId: number | null;
  airplaneId: number | null;
  flightNumber: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  status: string | null;
  imageUrl: string | null;
};
type Seat = { id: number; flightId: number | null; seatNumber: string | null; booked: boolean; };
```

### Booking / Payment / Ticket / Checkin
```ts
type Booking = { id: number; userId: number; passengerId: number; flightId: number; seatNumber: string; status: string; };
type Payment = { id: number; userId: number; bookingId: number; passengerId: number; flightId: number; status: 'PENDING' | 'PAID' | 'FAILED' | string; };
type Ticket = { id: number; userId: number; ticketCode: string; bookingId: number; passengerId: number; flightId: number; seatNumber: string; status: string; };
type Checkin = { id: number; userId: number; ticketCode: string; status: string; bookingId: number; passengerId: number; flightId: number; };
```

## 5) API contracts

### Auth
- `POST /api/auth/register`
Request:
```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "password": "secret123",
  "phone": "0901234567"
}
```
Response `201`: `UserResponse`

- `POST /api/auth/login`
Request:
```json
{
  "email": "a@example.com",
  "password": "secret123"
}
```
Response `200`:
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

- `GET /api/auth/me` -> `UserResponse`

### User
- `POST /api/users/me/avatar` (multipart/form-data, key `file`, <=5MB, jpeg/png/webp)
Response:
```json
{ "imageUrl": "https://..." }
```

- Admin users:
  - `GET /api/users`
  - `GET /api/users/{id}`
  - `PUT /api/users/{id}`
  - `DELETE /api/users/{id}`

### Admin Dashboard
- `GET /api/admin/dashboard/summary`

### Flight domain
- Airports: `GET/POST/PUT/DELETE /api/airports`, `POST /api/airports/{id}/image`
- Airplanes: `GET/POST/PUT/DELETE /api/airplanes`, `POST /api/airplanes/{id}/image`
- Flights: `GET /api/flights`, `GET /api/flights/{id}`, `POST /api/flights`, `POST /api/flights/{id}/image`
- Seats: `GET /api/seats?flightId=...`, `POST /api/seats`, `GET /api/seats/availability?flightId=...&seatNumber=...`, `PUT /api/seats/{id}/book`

### Passenger
- `GET /api/passengers` (admin)
- `GET /api/passengers/me`
- `GET /api/passengers/search?keyword=...`
- `GET /api/passengers/{id}`
- `POST /api/passengers`
- `PUT /api/passengers/{id}`
- `DELETE /api/passengers/{id}`

### Booking
- `GET /api/bookings` (admin)
- `GET /api/bookings/me`
- `GET /api/bookings/{id}`
- `POST /api/bookings`
Request:
```json
{
  "passengerId": 10,
  "flightId": 3,
  "seatNumber": "A1"
}
```

### Payment
- `GET /api/payments` (admin)
- `GET /api/payments/me`
- `GET /api/payments/booking/{bookingId}`
- `PUT /api/payments/{id}/pay`
- `PUT /api/payments/{id}/fail` (admin)

### Ticket
- `GET /api/tickets` (admin)
- `GET /api/tickets/me`
- `GET /api/tickets/booking/{bookingId}`
- `GET /api/tickets/passenger/{passengerId}`
- `GET /api/tickets/code/{ticketCode}`

### Checkin
- `GET /api/checkins` (admin)
- `GET /api/checkins/me`
- `POST /api/checkins`
Request:
```json
{
  "ticketCode": "TCK-20260509-ABCD"
}
```
- `GET /api/checkins/ticket/{ticketCode}`

## 6) Màn hình bắt buộc

### Public
1. Login page
2. Register page
3. Flights list (Trang chủ E-commerce)
4. Flight detail (Bấm 'Đặt vé' sẽ yêu cầu login)

### User area (Yêu cầu đăng nhập)
5. My profile + avatar upload
6. My passengers CRUD + search
7. Create booking form
8. My bookings list
9. My payments list + pay action
10. My tickets list + search by ticketCode
11. Check-in page + history

### Admin area
12. Dashboard summary
13. User management
14. Airport management + upload image
15. Airplane management + upload image
16. Flight management + upload image
17. Seat management
18. Passenger management
19. Booking monitor
20. Payment monitor (+ fail/pay actions theo role)
21. Ticket monitor
22. Checkin monitor

## 7) UI behavior requirements
- Tất cả form có validate bằng Zod.
- Hiển thị lỗi field-level và API-level.
- List pages có:
  - loading
  - empty state
  - error state
  - client-side pagination/sort/filter
- Passenger search phải gọi backend query `keyword`.
- Sau khi pay thành công:
  - hiển thị trạng thái payment mới
  - polling ticket API mỗi 1-2s trong tối đa 10 lần để lấy ticket mới.
- Date-time hiển thị local timezone user.

## 8) Error handling requirements
- 400: show business message từ server.
- 401/403: logout + redirect login.
- 404: show not found message.
- Mọi request cần try/catch và toast thông báo.

## 9) Code architecture requirements
- Cấu trúc thư mục rõ ràng:
  - `src/api`
  - `src/features/auth`
  - `src/features/flights`
  - ...
  - `src/components`
  - `src/layouts`
  - `src/routes`
  - `src/lib`
- Tách:
  - type definitions
  - api services
  - hooks query/mutation
  - presentational components
- Reusable `ProtectedRoute` và `AdminRoute`.

## 10) Output expectations
Hãy sinh:
1. Source code đầy đủ frontend.
2. `README.md` hướng dẫn chạy.
3. `.env.example` với `VITE_API_BASE_URL=http://localhost:8080`.
4. Mẫu dữ liệu fallback/mock nhẹ để dev UI khi backend chậm.

Ưu tiên clean architecture, type-safe, dễ maintain, và UX tốt.
