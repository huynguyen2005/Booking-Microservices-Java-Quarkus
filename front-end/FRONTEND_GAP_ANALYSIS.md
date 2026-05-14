# Frontend Gap Analysis

## Public / User App

| Module | Required by docs | Current implementation | Status | Missing/Issue | Fix plan |
|---|---|---|---|---|---|
| Auth: Login | `/login` page | `LoginPage.tsx` | DONE | None | N/A |
| Auth: Register | `/register` page | `RegisterPage.tsx` | DONE | None | N/A |
| Flight List | `/flights` public list | `FlightsListPage.tsx` | DONE | None | N/A |
| Flight Detail | `/flights/:id` | `FlightDetail.tsx` | PARTIAL | Missing seat availability logic & UI | Implement `seatService` and show seat map / available seats |
| Profile | `/profile` | `ProfilePage.tsx` | PARTIAL | Missing avatar upload | Integrate user avatar upload API |
| My Passengers | `/my-passengers` | `MyPassengersPage.tsx` | DONE | None | N/A |
| Booking Process | `/bookings/new` | `BookingProcessPage.tsx` at `/flights/:id/booking` | DONE | None | N/A |
| My Bookings | `/my-bookings` | Embedded in Profile | MISSING | No distinct route `/my-bookings` mapped in `App.tsx` | Create `MyBookingsPage.tsx`, map route in `App.tsx`, fetch `/api/bookings/me` |
| My Payments | `/my-payments` | `MyPaymentsPage.tsx` | DONE | None | N/A |
| Ticket Search/Checkin | `/checkin` | `CheckinPage.tsx` | DONE | None | N/A |
| My Tickets | `/my-tickets` | `MyTicketsPage.tsx` | DONE | None | N/A |

## Admin App

| Module | Required by docs | Current implementation | Status | Missing/Issue | Fix plan |
|---|---|---|---|---|---|
| Dashboard | `/admin/dashboard` | `DashboardPage.tsx` | DONE | None | N/A |
| Users | `/admin/users` | `AdminUsersPage.tsx` | PARTIAL | Missing update/delete actions | Add update/delete forms |
| Airports | `/admin/airports` | `AdminAirportsPage.tsx` | PARTIAL | Has CRUD API, missing image upload | Add image upload API integration |
| Airplanes | `/admin/airplanes` | `AdminAirplanesPage.tsx` | PARTIAL | Has CRUD API, missing image upload | Add image upload API integration |
| Flights | `/admin/flights` | `AdminFlightsPage.tsx` | PARTIAL | Has GET/POST API, missing update/delete & image upload | Add update/delete actions & image upload |
| Seats | `/admin/seats` | `AdminSeatsPage.tsx` | PARTIAL | Missing creation logic | Add seat creation form |
| Passengers | `/admin/passengers` | `AdminPassengersPage.tsx` | PARTIAL | Has READ API, missing create/update/delete | Add modal/form to CUD `/api/passengers` |
| Bookings | `/admin/bookings` | `AdminBookingsPage.tsx` | DONE | None | N/A |
| Payments | `/admin/payments` | `AdminPaymentsPage.tsx` | DONE | None | N/A |
| Tickets | `/admin/tickets` | `AdminTicketsPage.tsx` | DONE | None | N/A |
| Checkins | `/admin/checkins` | `AdminCheckinsPage.tsx` | DONE | None | N/A |

## Services / API Client

| Module | Required by docs | Current implementation | Status | Missing/Issue | Fix plan |
|---|---|---|---|---|---|
| Auth Header | Attach JWT to requests | `http.ts` | DONE | None | N/A |
| Domain Services| Separate API classes | Mixed in `endpoints.ts` | DONE | API grouped by domain in `endpoints.ts` | Good enough for now |

## UI / UX

| Module | Required by docs | Current implementation | Status | Missing/Issue | Fix plan |
|---|---|---|---|---|---|
| Auth Guard | Protect routes | `AdminRoute.tsx`, `ProtectedRoute.tsx` | DONE | Enforces role=ADMIN properly | N/A |
| Loading States| Show loading UX | Basic text | PARTIAL | Basic strings used | Add Skeleton loaders or spinners |
| Error States | Handle API errors | Console or basic text | PARTIAL | Needs global toast | Implement Toast / Dialog handling |
