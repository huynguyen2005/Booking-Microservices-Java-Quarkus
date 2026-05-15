# Frontend Upgrade Report

## Route -> API Mapping

### Public
- `/login` -> `POST /api/auth/login` -> Da co
- `/register` -> `POST /api/auth/register` -> Da co
- `/flights` -> `GET /api/flights/search` (+ airport options) -> Da nang cap
- `/flights/:id` -> `GET /api/flights/{id}` + `GET /api/seats?flightId=` -> Da co

### USER
- `/profile` -> `GET /api/auth/me`, `POST /api/users/me/avatar` -> Da nang cap validate upload <=5MB + mime
- `/my-passengers` -> CRUD + search passenger -> Da co
- `/bookings/new` -> create booking + seat list -> Da nang cap (chan status flight khong hop le)
- `/my-bookings` -> `GET /api/bookings/me`, `PUT /api/bookings/{id}/cancel` -> Da bo sung
- `/my-payments` -> list/filter, simulate success/fail -> Da nang cap polling async booking/ticket
- `/my-tickets` -> list + search by code -> Da nang cap sang `GET /api/tickets/search`
- `/checkin` -> create + list checkin -> Da co

### ADMIN
- `/admin/dashboard` -> summary -> Da co
- `/admin/users` -> list/detail/update/delete/search API layer -> Da bo sung API search
- `/admin/airports` -> CRUD + upload -> Da co
- `/admin/airplanes` -> CRUD + upload -> Da co
- `/admin/flights` -> CRUD + upload -> Da co
- `/admin/seats` -> create/book/list -> Da cap nhat filter call
- `/admin/passengers` -> list/search/crud -> Da co
- `/admin/bookings` -> list -> Da co (API search da bo sung layer)
- `/admin/payments` -> list + fail/pay -> Da co (API search bo sung)
- `/admin/tickets` -> list/search -> Da co (API search bo sung)
- `/admin/checkins` -> list -> Da co (API search bo sung)

## Business Status Display
- Booking: `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `EXPIRED` -> Da bo sung badge
- Payment: `PENDING`, `PAID`, `FAILED` -> Da co
- Ticket: `ISSUED` -> Da co
- Checkin: `CHECKED_IN` -> Da co
- Seat: `AVAILABLE`, `HELD`, `BOOKED` -> Da bo sung badge

## Notes
- API layer duoc chuan hoa query params va bo sung endpoint search theo README-FRONT-END.
- Da bo sung fallback message va toast cho loi async/payment.
