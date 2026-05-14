# SkyFlow Frontend — REBUILD PLAN

## 1. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 19 + TypeScript 6 | Already in package.json |
| Build | Vite 8 | Already configured with proxy |
| Routing | React Router 7 | Already installed |
| Data fetching | TanStack React Query 5 | Already installed |
| HTTP | Axios 1.16 | Already installed, http.ts reusable |
| Forms | React Hook Form 7 + Zod 4 | Already installed |
| Styling | Tailwind CSS 4 (via @tailwindcss/vite) | Already installed |
| UI Components | Custom (cva + clsx + tailwind-merge) | Already have Button.tsx pattern |
| Icons | Lucide React | Already installed |
| Toasts | react-hot-toast | Already installed |

**No new dependencies needed.** All packages already present.

## 2. Folder Structure (NEW)

```
src/
├── api/
│   ├── http.ts              ← KEEP (interceptor + proxy)
│   └── endpoints.ts         ← REWRITE (split by domain)
├── components/
│   ├── ui/                  ← KEEP+EXTEND (Button, Modal, DataTable, etc.)
│   ├── AdminRoute.tsx       ← KEEP
│   └── ProtectedRoute.tsx   ← KEEP
├── layouts/
│   ├── UserLayout.tsx       ← REWRITE (B2C travel website look)
│   └── AdminLayout.tsx      ← REWRITE (SaaS dashboard look)
├── lib/
│   ├── auth.tsx             ← KEEP
│   └── utils.ts             ← KEEP
├── pages/
│   ├── LoginPage.tsx        ← REWRITE
│   ├── RegisterPage.tsx     ← REWRITE
│   ├── HomePage.tsx         ← REWRITE (B2C hero search + flight cards)
│   ├── FlightsListPage.tsx  ← REWRITE (travel e-commerce)
│   ├── FlightDetailPage.tsx ← REWRITE
│   ├── ProfilePage.tsx      ← REWRITE
│   ├── MyPassengersPage.tsx ← REWRITE
│   ├── BookingNewPage.tsx   ← REWRITE (stepper booking)
│   ├── MyBookingsPage.tsx   ← REWRITE
│   ├── MyPaymentsPage.tsx   ← REWRITE
│   ├── MyTicketsPage.tsx    ← REWRITE
│   ├── CheckinPage.tsx      ← REWRITE
│   └── admin/
│       ├── DashboardPage.tsx
│       ├── AdminUsersPage.tsx
│       ├── AdminAirportsPage.tsx
│       ├── AdminAirplanesPage.tsx
│       ├── AdminFlightsPage.tsx
│       ├── AdminSeatsPage.tsx
│       ├── AdminPassengersPage.tsx
│       ├── AdminBookingsPage.tsx
│       ├── AdminPaymentsPage.tsx
│       ├── AdminTicketsPage.tsx
│       └── AdminCheckinsPage.tsx
├── App.tsx                  ← REWRITE
├── main.tsx                 ← KEEP
└── index.css                ← REWRITE
```

## 3. Routes

### Public
| Path | Page | API |
|---|---|---|
| `/` | HomePage (redirect to /flights) | GET /api/flights, GET /api/airports |
| `/flights` | FlightsListPage | GET /api/flights, GET /api/airports |
| `/flights/:id` | FlightDetailPage | GET /api/flights/{id}, GET /api/seats?flightId= |
| `/login` | LoginPage | POST /api/auth/login |
| `/register` | RegisterPage | POST /api/auth/register |

### User (ProtectedRoute)
| Path | Page | API |
|---|---|---|
| `/profile` | ProfilePage | GET /api/auth/me, POST /api/users/me/avatar |
| `/my-passengers` | MyPassengersPage | GET /api/passengers/me, POST/PUT/DELETE |
| `/bookings/new` | BookingNewPage | GET /api/passengers/me, GET /api/flights, GET /api/seats/availability, POST /api/bookings |
| `/my-bookings` | MyBookingsPage | GET /api/bookings/me |
| `/my-payments` | MyPaymentsPage | GET /api/payments/me, PUT /api/payments/{id}/pay |
| `/my-tickets` | MyTicketsPage | GET /api/tickets/me, GET /api/tickets/code/{code} |
| `/checkin` | CheckinPage | POST /api/checkins, GET /api/checkins/me |

### Admin (AdminRoute)
| Path | Page | API |
|---|---|---|
| `/admin/dashboard` | DashboardPage | GET /api/admin/dashboard/summary |
| `/admin/users` | AdminUsersPage | GET/PUT/DELETE /api/users |
| `/admin/airports` | AdminAirportsPage | GET/POST/PUT/DELETE /api/airports, POST image |
| `/admin/airplanes` | AdminAirplanesPage | GET/POST/PUT/DELETE /api/airplanes, POST image |
| `/admin/flights` | AdminFlightsPage | GET/POST /api/flights, POST image |
| `/admin/seats` | AdminSeatsPage | GET/POST /api/seats, PUT book |
| `/admin/passengers` | AdminPassengersPage | GET /api/passengers, search |
| `/admin/bookings` | AdminBookingsPage | GET /api/bookings |
| `/admin/payments` | AdminPaymentsPage | GET /api/payments, pay/fail |
| `/admin/tickets` | AdminTicketsPage | GET /api/tickets, code search |
| `/admin/checkins` | AdminCheckinsPage | GET /api/checkins |

## 4. API Services

All in `src/api/endpoints.ts`:
- `authApi` — login, register, me
- `userApi` — avatar upload
- `adminApi` — dashboard summary, users CRUD
- `flightApi` — airports, airplanes, flights, seats CRUD + image upload
- `passengerApi` — CRUD + search
- `bookingApi` — list, me, create, detail
- `paymentApi` — list, me, pay, fail
- `ticketApi` — list, me, by booking/passenger/code
- `checkinApi` — list, me, create, by ticket

## 5. Parts to KEEP from current codebase

| File | Reason |
|---|---|
| `vite.config.ts` | Proxy setup correct |
| `package.json` | All deps already installed |
| `src/lib/http.ts` | Interceptor logic correct |
| `src/lib/auth.tsx` | Auth context logic correct |
| `src/lib/utils.ts` | cn() utility |
| `src/components/ProtectedRoute.tsx` | Logic correct |
| `src/components/AdminRoute.tsx` | Logic correct |
| `src/components/ui/Button.tsx` | Well-designed CVA button |
| `src/main.tsx` | Entry point correct |
| `tsconfig.json` | Config correct |

## 6. Parts to DELETE/REPLACE

| File/Dir | Reason |
|---|---|
| All pages in `src/pages/` | Rewrite with proper B2C / B2B split |
| `src/layouts/UserLayout.tsx` | Rewrite for B2C travel website UX |
| `src/layouts/AdminLayout.tsx` | Rewrite for SaaS dashboard UX |
| `src/api/endpoints.ts` | Rewrite with exact API spec match |
| `src/index.css` | Rewrite with proper design tokens + form input styles |
| `src/App.tsx` | Rewrite routes + add /bookings/new |
| `src/components/ui/Toast.tsx` | Rewrite (simplify wrapper) |
| `src/components/ui/Modal.tsx` | Keep but fix |
| `src/components/ui/DataTable.tsx` | Keep but improve |
| `src/components/ui/DarkModeToggle.tsx` | Keep |
| Old docs files (IMPLEMENTATION_SUMMARY, etc.) | Will regenerate |

## 7. Key Risks

1. **Forms broken in dark mode** — Current inputs use `border` class without explicit `border-color`, causing invisible borders in dark mode. Fix: add `border-[var(--color-border)]` and explicit `bg-[var(--color-surface)]` to all inputs.

2. **Login/Register pages** — Not using proper input styling from design tokens. Inputs have invisible text/border in dark mode.

3. **B2C vs B2B confusion** — Current UserLayout uses sidebar-like dropdown menu. Need to make it clearly a travel website with top nav + hero search.

4. **Missing route /bookings/new** — Docs require dedicated booking page, current has /flights/:id/booking.

5. **Flight PUT/DELETE** — API_SPEC.md does NOT list PUT/DELETE for flights. Only GET, POST, POST image. Frontend should not offer edit/delete flights.

## 8. API Uncertainties

| API | Issue | Status |
|---|---|---|
| `PUT /api/flights/{id}` | Not in API_SPEC, but used in admin page | BLOCKED_BY_API_SPEC |
| `DELETE /api/flights/{id}` | Not in API_SPEC | BLOCKED_BY_API_SPEC |
| Flight search/filter | Backend has no query params for flights | Client-side only |
| Pagination | Backend returns all records | Client-side only |
| Sort | Backend has no sort params | Client-side only |

## 9. Implementation Order

1. **index.css** — Design tokens + global input/form styles (fixes ALL form bugs)
2. **endpoints.ts** — Clean API client matching docs exactly
3. **UI components** — Toast, Modal, DataTable, StatusBadge, LoadingSkeleton, EmptyState, ConfirmDialog
4. **Layouts** — UserLayout (B2C) + AdminLayout (B2B SaaS)
5. **Auth pages** — Login + Register
6. **Public pages** — HomePage, FlightsListPage, FlightDetailPage
7. **User pages** — Profile, MyPassengers, BookingNew, MyBookings, MyPayments, MyTickets, Checkin
8. **Admin pages** — Dashboard, Users, Airports, Airplanes, Flights, Seats, Passengers, Bookings, Payments, Tickets, Checkins
9. **App.tsx** — Final routing
10. **Validation** — tsc --noEmit + npm run build
