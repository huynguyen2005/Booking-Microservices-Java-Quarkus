# Frontend Remaining Tasks

## P0 (Critical - Blocking core flows)
1. **Route `/my-bookings` is MISSING**: 
   - *File*: `src/App.tsx`, `src/pages/MyBookingsPage.tsx`
   - *API*: `GET /api/bookings/me`
   - *Risk*: User cannot access the specific route required by docs. It's currently embedded in `ProfilePage` but a distinct route must be available.
2. **Admin Users Page mock UI**:
   - *File*: `src/pages/admin/AdminUsersPage.tsx`
   - *API*: `GET /api/users`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`
   - *Risk*: Admin cannot view or manage real users.
3. **Admin Bookings Page mock UI**:
   - *File*: `src/pages/admin/AdminBookingsPage.tsx`
   - *API*: `GET /api/bookings`
   - *Risk*: Admin cannot view real bookings, blocking management operations.
4. **Admin Seats Page mock UI**:
   - *File*: `src/pages/admin/AdminSeatsPage.tsx`
   - *API*: `GET /api/seats`, `POST /api/seats`, `PUT /api/seats/{id}/book`
   - *Risk*: Admin cannot create or view seats for flights.

## P1 (Important - Missing functionality)
1. **Admin CRUD for Passengers**:
   - *File*: `src/pages/admin/AdminPassengersPage.tsx`
   - *API*: `POST`, `PUT`, `DELETE /api/passengers/{id}`
   - *Risk*: Admin can view but not manage passengers.
2. **Admin CRUD for Flights**:
   - *File*: `src/pages/admin/AdminFlightsPage.tsx`
   - *API*: `PUT`, `DELETE /api/flights/{id}`
   - *Risk*: Incomplete flight management.
3. **Image Upload Features**:
   - *Files*: ProfilePage (Avatar), AdminAirportsPage, AdminAirplanesPage, AdminFlightsPage
   - *API*: POST to `.../image` and `.../avatar`
   - *Risk*: Cannot manage media assets.
4. **Seat Availability in Flight Detail**:
   - *File*: `src/pages/FlightDetail.tsx`
   - *API*: `GET /api/seats/availability`
   - *Risk*: Users cannot see available seats before booking.

## P2 (Enhancements - UI/UX Polish)
1. **Toast Notifications & Error Boundaries**: Replace `alert()` and basic error text with a proper Toast system.
2. **Skeleton Loaders**: Replace `<div>Đang tải...</div>` with nicer skeleton UI.
3. **UI Polish**: Minor alignment and spacing fixes.
