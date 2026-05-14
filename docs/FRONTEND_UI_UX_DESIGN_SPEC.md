# SaaS Frontend UI/UX Design Specification

## 1. Product design direction
- Phong cách: Linear + Stripe Dashboard + Vercel, tối giản, dữ liệu rõ ràng, whitespace rộng.
- Mục tiêu: production-ready, không cảm giác template admin cũ.
- Nguyên tắc:
  - Clarity first (ưu tiên đọc dữ liệu nhanh).
  - Action proximity (hành động đặt gần dữ liệu liên quan).
  - Progressive disclosure (mặc định gọn, mở rộng khi cần).
  - Consistent interaction (pattern lặp lại giữa các CRUD page).

## 2. Design system

## 2.1 Color tokens
Dùng neutral hiện đại, accent xanh dương lạnh, tránh cảm giác default boilerplate.

```css
:root {
  --bg: #f7f8fa;
  --surface: #ffffff;
  --surface-subtle: #f2f4f7;
  --text: #0f172a;
  --text-muted: #475467;
  --border: #e4e7ec;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-soft: #dbeafe;
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
  --info: #0891b2;
  --focus-ring: #93c5fd;
}

.dark {
  --bg: #0b1220;
  --surface: #111827;
  --surface-subtle: #1f2937;
  --text: #e5e7eb;
  --text-muted: #9ca3af;
  --border: #243041;
  --primary: #60a5fa;
  --primary-hover: #3b82f6;
  --primary-soft: #1e3a8a;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  --focus-ring: #3b82f6;
}
```

### Semantic status mapping
- `CREATED` -> info badge
- `PENDING` -> warning badge
- `PAID` / `CHECKED_IN` / `ISSUED` -> success badge
- `FAILED` -> danger badge

## 2.2 Typography tokens
```css
--font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
--font-mono: "JetBrains Mono", monospace;

--fs-12: 12px;
--fs-14: 14px;
--fs-16: 16px;
--fs-18: 18px;
--fs-20: 20px;
--fs-24: 24px;
--fs-30: 30px;

--lh-tight: 1.2;
--lh-normal: 1.5;
--lh-relaxed: 1.7;
```

Hierarchy:
- Page title: 24/30 semibold
- Section title: 18/20 semibold
- Card metric: 24 bold
- Body: 14/16 regular
- Caption/meta: 12 muted

## 2.3 Spacing tokens (8px system)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

Layout spacing rules:
- Page padding desktop: 32px
- Page padding tablet: 24px
- Page padding mobile: 16px
- Card gap: 16px/24px
- Form row gap: 16px

## 2.4 Radius, border, shadow
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;

--shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
--shadow-md: 0 8px 24px rgba(16, 24, 40, 0.08);
```

## 3. Core component variants

## 3.1 Buttons
- Primary: solid `--primary`, white text.
- Secondary: surface + border.
- Ghost: transparent.
- Danger: red solid.
- Sizes: sm(32), md(40), lg(44).
- States: hover, active, disabled, focus ring.

## 3.2 Inputs
- Default height 40.
- Prefix/suffix support cho search, seat check.
- Validation states:
  - error border + error text
  - success subtle icon
- Disabled opacity + no pointer.

## 3.3 Table pattern
- Sticky header.
- Zebra very subtle optional.
- Row hover highlight.
- Column sorting client-side (icon up/down).
- Pagination client-side footer.
- Row actions menu (`View/Edit/Delete`).

## 3.4 Form pattern
- Label top aligned, helper text dưới.
- Required marker `*` rõ ràng.
- Section card: `Basic info`, `Relations`, `Actions`.
- Submit area sticky bottom trên mobile modal/drawer.

## 3.5 Feedback components
- Empty state: icon + 1 title + 1 desc + CTA.
- Loading: skeleton card/table rows.
- Error state: inline alert + retry button.
- Confirmation dialog: Delete/Fail/Pay actions.
- Toasts: top-right desktop, top-center mobile.

## 4. App shell design

## 4.1 Main layout
Ứng dụng được chia làm 2 hệ thống UI độc lập:

**1. User App (B2C E-commerce):**
- Không có sidebar. Dùng Top Navigation Bar.
- Width: Max-width 1200px (Centered container).
- Chú trọng Banner tìm kiếm lớn, Card chuyến bay đẹp mắt.

**2. Admin App (B2B SaaS Dashboard):**
- Desktop: Left sidebar fixed (width 264), Top nav sticky (height 64).
- Tablet: Collapsible sidebar (icon rail).
- Mobile: Slide-in menu drawer.

## 4.2 Sidebar IA
Sections:
- Core: Flights, Profile
- User Operations: My Passengers, My Bookings, My Payments, My Tickets, Check-in
- Admin (role-based): Dashboard, Users, Airports, Airplanes, Flights, Seats, Passengers, Bookings, Payments, Tickets, Checkins

Mỗi item có icon line-style, active state nền `primary-soft`.

## 4.3 Top navigation
- Left: breadcrumb + page title.
- Right: search quick (local page), theme toggle, notifications placeholder, avatar menu.
- Avatar menu: Profile, Logout.

## 5. Screen specifications (đúng flow)

## 5.1 Login (`/login`)
- API: `POST /api/auth/login`
- Layout: split panel (brand statement bên trái desktop, form card bên phải).
- Form fields: `email`, `password`.
- Actions: Login, link Register.
- States:
  - loading button spinner
  - error inline (400/401)

## 5.2 Register (`/register`)
- API: `POST /api/auth/register`
- Fields: `fullName`, `email`, `password`, `phone`.
- Success: toast + redirect login.

## 5.3 Flights list (`/flights`)
- APIs: `GET /api/flights`, `GET /api/airports`, `GET /api/airplanes`
- UI:
  - top metric strip (total flights, unique routes, on-time placeholder)
  - card grid / table toggle
- Table columns (khớp data):
  - `flightNumber`, `departureAirportId`, `arrivalAirportId`, `departureTime`, `arrivalTime`, `status`, `imageUrl`
- Client filter/sort/pagination.

## 5.4 Flight detail (`/flights/:id`)
- APIs: `GET /api/flights/{id}`, `GET /api/seats?flightId=`, `GET /api/seats/availability`
- Sections:
  - Flight overview card
  - Seat list table (`seatNumber`, `booked`)
  - Seat availability checker form: `flightId`, `seatNumber`

## 5.5 My profile (`/profile`)
- APIs: `GET /api/auth/me`, `POST /api/users/me/avatar`
- UI:
  - profile summary card
  - avatar upload dropzone/button
  - metadata chips: role, joined date

## 5.6 My passengers (`/my-passengers`)
- APIs: `GET /api/passengers/me`, `GET /api/passengers/search`, `POST`, `PUT`, `DELETE`
- Table columns:
  - `fullName`, `email`, `phone`, `passportNumber`
- Form fields (create/edit):
  - `fullName`, `email`, `phone`, `passportNumber`
- Features:
  - server search box (`keyword`)
  - create/edit modal
  - delete confirm dialog

## 5.7 Create booking (`/bookings/new`)
- APIs: `GET /api/passengers/me`, `GET /api/flights`, `GET /api/seats/availability`, `POST /api/bookings`
- Form fields:
  - `passengerId` (select)
  - `flightId` (select)
  - `seatNumber` (input)
- Extra UX:
  - "Check Seat" secondary button gọi availability
  - CTA chính: "Create Booking"

## 5.8 My bookings (`/my-bookings`)
- API: `GET /api/bookings/me`
- Table columns:
  - `id`, `passengerId`, `flightId`, `seatNumber`, `status`
- Row action:
  - `View Payment` -> điều hướng `/my-payments?bookingId=`

## 5.9 My payments (`/my-payments`)
- APIs: `GET /api/payments/me`, `GET /api/payments/booking/{bookingId}`, `PUT /api/payments/{id}/pay`
- Table columns:
  - `id`, `bookingId`, `passengerId`, `flightId`, `status`
- Action:
  - nếu `status=PENDING` hiển thị nút `Pay`
  - sau pay: toast + refresh + trigger polling tickets (UX hint banner)

## 5.10 My tickets (`/my-tickets`)
- APIs: `GET /api/tickets/me`, `GET /api/tickets/code/{ticketCode}`, `GET /api/tickets/booking/{bookingId}`
- Search block:
  - input `ticketCode`
  - button `Find Ticket`
- Table columns:
  - `ticketCode`, `bookingId`, `passengerId`, `flightId`, `seatNumber`, `status`

## 5.11 Check-in (`/checkin`)
- APIs: `POST /api/checkins`, `GET /api/checkins/me`, `GET /api/checkins/ticket/{ticketCode}`
- Form: `ticketCode`
- History table columns:
  - `ticketCode`, `bookingId`, `passengerId`, `flightId`, `status`

## 5.12 Admin dashboard (`/admin/dashboard`)
- API: `GET /api/admin/dashboard/summary`
- Widgets:
  - usersTotal, flightsTotal, bookingsTotal, paymentsTotal, pending/paid/failed, ticketsTotal, checkinsTotal
- Visualization:
  - KPI cards + payment status stacked bar (client chart)

## 5.13 Admin users (`/admin/users`)
- APIs: `GET /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`
- Table columns:
  - `id`, `fullName`, `email`, `phone`, `role`, `createdAt`
- Edit form fields:
  - `fullName`, `email`, `phone`, `password`, `role`

## 5.14 Admin airports (`/admin/airports`)
- APIs: `GET/POST/PUT/DELETE /api/airports`, `POST /api/airports/{id}/image`
- Table columns:
  - `id`, `code`, `name`, `city`, `imageUrl`
- Form fields:
  - `code`, `name`, `city`
- Upload action per row/card.

## 5.15 Admin airplanes (`/admin/airplanes`)
- APIs: `GET/POST/PUT/DELETE /api/airplanes`, `POST /api/airplanes/{id}/image`
- Table columns:
  - `id`, `code`, `model`, `totalSeats`, `imageUrl`
- Form fields:
  - `code`, `model`, `totalSeats`

## 5.16 Admin flights (`/admin/flights`)
- APIs: `GET /api/flights`, `POST /api/flights`, `POST /api/flights/{id}/image`
- Table columns:
  - `id`, `flightNumber`, `departureAirportId`, `arrivalAirportId`, `airplaneId`, `departureTime`, `arrivalTime`, `status`, `imageUrl`
- Form fields:
  - `departureAirportId`, `arrivalAirportId`, `airplaneId`, `flightNumber`, `departureTime`, `arrivalTime`, `status`

## 5.17 Admin seats (`/admin/seats`)
- APIs: `GET /api/seats`, `POST /api/seats`, `PUT /api/seats/{id}/book`
- Filter: `flightId`
- Table columns:
  - `id`, `flightId`, `seatNumber`, `booked`
- Form fields:
  - `flightId`, `seatNumber`, `booked` (create default false)

## 5.18 Admin passengers (`/admin/passengers`)
- APIs: `GET /api/passengers`, `GET /api/passengers/search`, `PUT`, `DELETE`
- Table columns:
  - `id`, `userId`, `fullName`, `email`, `phone`, `passportNumber`
- Search: `keyword`

## 5.19 Admin bookings (`/admin/bookings`)
- API: `GET /api/bookings`
- Table columns:
  - `id`, `userId`, `passengerId`, `flightId`, `seatNumber`, `status`

## 5.20 Admin payments (`/admin/payments`)
- APIs: `GET /api/payments`, `PUT /api/payments/{id}/pay`, `PUT /api/payments/{id}/fail`
- Table columns:
  - `id`, `userId`, `bookingId`, `passengerId`, `flightId`, `status`
- Row actions:
  - `Pay` (nếu pending)
  - `Fail` (admin confirm dialog)

## 5.21 Admin tickets (`/admin/tickets`)
- APIs: `GET /api/tickets`, `GET /api/tickets/code/{ticketCode}`
- Table columns:
  - `id`, `userId`, `ticketCode`, `bookingId`, `passengerId`, `flightId`, `seatNumber`, `status`

## 5.22 Admin checkins (`/admin/checkins`)
- API: `GET /api/checkins`
- Table columns:
  - `id`, `userId`, `ticketCode`, `bookingId`, `passengerId`, `flightId`, `status`

## 6. Reusable UI patterns

## 6.1 Page header pattern
- `Title` + `Description` + right-side actions.
- Optional secondary line: breadcrumbs.

## 6.2 CRUD page pattern
- Header
- Control row: search/filter/actions
- Table card
- Pagination footer
- Modal form (create/edit)
- Confirm dialog (delete/destructive)

## 6.3 Detail page pattern
- Top summary card
- Related datasets in tabs/sections
- Contextual actions right column

## 6.4 Async operation pattern (payment -> ticket)
- Inline progress notice:
  - "Payment completed. Issuing ticket..."
- Poll state indicator + manual refresh.

## 7. Responsive behavior

Breakpoints:
- Mobile: `<768`
- Tablet: `768-1279`
- Desktop: `>=1280`

Rules:
- Sidebar:
  - desktop fixed
  - tablet collapsed rail
  - mobile drawer
- Tables:
  - desktop full table
  - mobile card-list transform for dense pages (users, tickets, payments)
- Forms:
  - desktop 2-column where logical
  - mobile single-column only

## 8. Accessibility and usability
- Contrast đảm bảo WCAG AA.
- Keyboard focus visible rõ ring.
- Dialog trap focus + escape close.
- Form error gắn `aria-describedby`.
- Table action có accessible label.

## 9. Empty/loading/error templates

### Empty state copy tone
- Title ngắn, rõ hành động.
- Ví dụ: "No passengers yet" + CTA "Add passenger".

### Loading skeleton
- Table: 6-8 skeleton rows.
- Cards: shimmer blocks tương ứng layout.

### Error state
- Alert card gồm:
  - message
  - technical hint nếu có
  - `Retry` button

## 10. Token-to-component mapping quick reference
- Primary button: `--primary`
- Cards: `--surface + --border + --shadow-sm`
- Page bg: `--bg`
- Badges status: semantic map tại mục 2.1
- Input focus: `outline: 2px solid var(--focus-ring)`

## 11. Non-functional UI requirements
- Perceived performance: optimistic UI cho update nhẹ khi hợp lý.
- API errors phải normalize về 1 toast format thống nhất.
- Preserve filters/query params trên navigation nội bộ.
- Theme persistence (dark/light) trong local storage.

## 12. Handoff checklist cho frontend dev
- [ ] Không thêm field ngoài API spec.
- [ ] Không thêm page ngoài screen flow.
- [ ] Mọi form field khớp request body.
- [ ] Mọi cột table khớp response.
- [ ] Có loading/empty/error/confirm/toast cho mỗi page data.
- [ ] Có auth guard + admin guard.
- [ ] Có responsive desktop/tablet/mobile.
- [ ] Có dark mode.
