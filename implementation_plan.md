# SkyFlow Frontend - Implementation Plan

## 📊 Current State vs Requirements Gap Analysis

### File Inventory (Current)
| Category | Files | Status |
|----------|-------|--------|
| Pages (User) | 12 files | Partially implemented |
| Pages (Admin) | 12 files | Partially implemented |
| Components | 3 files (Button, ProtectedRoute, AdminRoute) | Minimal |
| Layouts | 2 files (UserLayout, AdminLayout) | Basic |
| API | 1 file (endpoints.ts) + http.ts | Missing many endpoints |
| Auth | auth.tsx | Functional |
| CSS | index.css | Minimal tokens |

---

## 🔴 Critical Gaps (Must Fix)

### 1. API Layer (`endpoints.ts`)
| Gap | Required | Current |
|-----|----------|---------|
| Avatar upload | `POST /api/users/me/avatar` (multipart) | ❌ Missing |
| Airport image upload | `POST /api/airports/{id}/image` | ❌ Missing |
| Airplane image upload | `POST /api/airplanes/{id}/image` | ❌ Missing |
| Flight image upload | `POST /api/flights/{id}/image` | ❌ Missing |
| Flight update/delete | `PUT/DELETE /api/flights/{id}` | ❌ Missing |
| Seat availability | `GET /api/seats/availability` | ❌ Missing |
| Seat book | `PUT /api/seats/{id}/book` | ❌ Missing |
| Passenger search | `GET /api/passengers/search?keyword=` | ❌ Missing |
| Passenger by ID | `GET /api/passengers/{id}` | ❌ Missing |
| Booking by ID | `GET /api/bookings/{id}` | ❌ Missing |
| Payment by booking | `GET /api/payments/booking/{bookingId}` | ❌ Missing |
| Ticket by booking | `GET /api/tickets/booking/{bookingId}` | ❌ Missing |
| Ticket by passenger | `GET /api/tickets/passenger/{passengerId}` | ❌ Missing |
| Checkin by ticket | `GET /api/checkins/ticket/{ticketCode}` | ❌ Missing |
| User get by ID | `GET /api/users/{id}` | ❌ Missing |

### 2. Pages - User Area
| Page | Gap |
|------|-----|
| **Register** | Missing `phone` field (required by spec) |
| **Profile** | Missing avatar upload (multipart) |
| **FlightDetail** | Shows airport IDs instead of names; missing seat list/availability checker |
| **BookingProcess** | No seat availability check before booking |
| **MyBookings** | No "View Payment" action per row |
| **MyPayments** | No ticket polling after payment (spec: poll 1-2s × 10 times) |
| **MyTickets** | No search-by-ticketCode feature |
| **Checkin** | Not protected (should require login) |
| **HomePage** | Uses hardcoded mock flight cards instead of real API data |

### 3. Pages - Admin Area
| Page | Gap |
|------|-----|
| **AdminUsers** | No edit modal/form; no delete action; "Add User" button does nothing |
| **AdminAirports** | No image upload feature |
| **AdminAirplanes** | No image upload feature |
| **AdminFlights** | No image upload feature |
| **AdminSeats** | No `PUT /api/seats/{id}/book` action; no flight filter |
| **AdminPassengers** | No search by keyword; no edit/delete actions; read-only |
| **AdminBookings** | Read-only, missing userId/passengerId display |
| **AdminPayments** | Missing pay action (admin); missing user/passenger columns |
| **AdminTickets** | Missing search by ticketCode; missing several columns |
| **AdminCheckins** | Read-only, minimal columns |
| **Dashboard** | Missing checkins card; missing 3rd info card |

### 4. Design System & UI
| Gap | Description |
|-----|-------------|
| Dark mode | Not implemented at all |
| Toast notifications | Uses `alert()` everywhere instead of toast system |
| Loading skeletons | Uses simple text "Loading..." instead of skeleton UI |
| Empty states | Inconsistent, some pages have icons, most don't |
| Confirmation dialogs | Uses `window.confirm()` instead of modal dialogs |
| Status badges | Inconsistent styling across pages |
| Client-side pagination | Not implemented on any table |
| Client-side sorting | Not implemented on any table |
| Responsive design | Basic only, no mobile card-list transform |
| Focus ring | Missing from index.css |
| Shadow/spacing tokens | Missing from index.css |

### 5. Infrastructure
| Gap | Description |
|-----|-------------|
| Error boundary | Not implemented |
| `.env.example` | Not created |
| Zod validation | Only on Login/Register forms, not on admin forms |
| Query invalidation | Inconsistent patterns |

---

## 📋 Implementation Phases

### Phase 1: Foundation (API + Design System + Core Components)
1. Complete `endpoints.ts` with ALL missing API methods
2. Expand `index.css` with full design tokens (dark mode, spacing, shadows)
3. Create reusable components: Toast, Modal, StatusBadge, DataTable, EmptyState, LoadingSkeleton, ConfirmDialog
4. Add dark mode toggle

### Phase 2: User Pages (Complete All)
5. Fix Register page (add phone field)
6. Complete Profile page (avatar upload)
7. Complete FlightDetail (resolve airport names, seats table, availability)
8. Complete HomePage (real API data instead of mocks)
9. Fix MyBookings (View Payment action)
10. Fix MyPayments (ticket polling after pay)
11. Fix MyTickets (search by ticketCode)
12. Fix CheckinPage (add auth guard, complete)
13. Fix BookingProcess (seat availability check)

### Phase 3: Admin Pages (Complete All)
14. Complete AdminUsers (edit form, delete, CRUD)
15. Complete AdminAirports (image upload)
16. Complete AdminAirplanes (image upload)
17. Complete AdminFlights (image upload, complete columns)
18. Complete AdminSeats (book action, flight filter)
19. Complete AdminPassengers (search, edit, delete)
20. Complete AdminBookings (full columns)
21. Complete AdminPayments (pay + fail actions, full columns)
22. Complete AdminTickets (search by code, full columns)
23. Complete AdminCheckins (full columns)
24. Complete Dashboard (all cards, chart)

### Phase 4: Polish
25. Replace all `alert()` with Toast
26. Replace all `window.confirm()` with ConfirmDialog
27. Add loading skeletons to all pages
28. Add client-side pagination to all tables
29. Add client-side sorting to all tables
30. Create `.env.example`
31. Ensure responsive across breakpoints

---

> [!IMPORTANT]
> This is a large undertaking (~30+ files to create/modify). Should I proceed with all phases sequentially, or would you prefer I focus on specific phases first?
