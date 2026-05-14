import { http } from '../lib/http';

/* ═══════════════════════════════════════════════════════════
   Types — Exactly matches API_SPEC.md §5
   ═══════════════════════════════════════════════════════════ */

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: string;
}

export interface Passenger {
  id: number;
  userId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  passportNumber: string | null;
}

export interface Airport {
  id: number;
  code: string | null;
  name: string | null;
  city: string | null;
  imageUrl: string | null;
}

export interface Airplane {
  id: number;
  code: string | null;
  model: string | null;
  totalSeats: number;
  imageUrl: string | null;
}

export interface Flight {
  id: number;
  departureAirportId: number;
  arrivalAirportId: number;
  airplaneId: number;
  flightNumber: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  status: string | null;
  imageUrl: string | null;
}

export interface Seat {
  id: number;
  flightId: number;
  seatNumber: string;
  booked: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  passengerId: number;
  flightId: number;
  seatNumber: string;
  status: string;
  bookingCode?: string;
}

export interface Payment {
  id: number;
  userId: number;
  bookingId: number;
  passengerId: number;
  flightId: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | string;
}

export interface Ticket {
  id: number;
  userId: number;
  ticketCode: string;
  bookingId: number;
  passengerId: number;
  flightId: number;
  seatNumber: string;
  status: string;
}

export interface Checkin {
  id: number;
  userId: number;
  ticketCode: string;
  status: string;
  bookingId: number;
  passengerId: number;
  flightId: number;
}

export interface DashboardSummary {
  usersTotal: number;
  adminUsersTotal: number;
  airportsTotal: number;
  airplanesTotal: number;
  flightsTotal: number;
  seatsTotal: number;
  passengersTotal: number;
  bookingsTotal: number;
  paymentsTotal: number;
  pendingPaymentsTotal: number;
  paidPaymentsTotal: number;
  failedPaymentsTotal: number;
  ticketsTotal: number;
  checkinsTotal: number;
}

/* ═══════════════════════════════════════════════════════════
   Auth — API_SPEC §6.1
   ═══════════════════════════════════════════════════════════ */

export const authApi = {
  register: (data: { fullName: string; email: string; password: string; phone?: string }) =>
    http.post<User>('/api/auth/register', data).then(r => r.data),

  login: (data: { email: string; password: string }) =>
    http.post<{ token: string; user: User }>('/api/auth/login', data).then(r => r.data),

  me: () =>
    http.get<User>('/api/auth/me').then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   User / Profile — API_SPEC §6.2
   ═══════════════════════════════════════════════════════════ */

export const userApi = {
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return http.post<{ imageUrl: string }>('/api/users/me/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

/* ═══════════════════════════════════════════════════════════
   Admin — API_SPEC §6.2, §6.3
   ═══════════════════════════════════════════════════════════ */

export const adminApi = {
  getSummary: () =>
    http.get<DashboardSummary>('/api/admin/dashboard/summary').then(r => r.data),

  getUsers: () =>
    http.get<User[]>('/api/users').then(r => r.data),

  getUserById: (id: number) =>
    http.get<User>(`/api/users/${id}`).then(r => r.data),

  updateUser: (id: number, data: Partial<User & { password?: string }>) =>
    http.put<User>(`/api/users/${id}`, data).then(r => r.data),

  deleteUser: (id: number) =>
    http.delete(`/api/users/${id}`).then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   Flight domain — API_SPEC §6.4
   ═══════════════════════════════════════════════════════════ */

export const flightApi = {
  // Airports (GET=Public, CRUD=ADMIN)
  getAirports: () => http.get<Airport[]>('/api/airports').then(r => r.data),
  createAirport: (data: Partial<Airport>) => http.post<Airport>('/api/airports', data).then(r => r.data),
  updateAirport: (id: number, data: Partial<Airport>) => http.put<Airport>(`/api/airports/${id}`, data).then(r => r.data),
  deleteAirport: (id: number) => http.delete(`/api/airports/${id}`).then(r => r.data),
  uploadAirportImage: (id: number, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return http.post(`/api/airports/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },

  // Airplanes (USER/ADMIN)
  getAirplanes: () => http.get<Airplane[]>('/api/airplanes').then(r => r.data),
  createAirplane: (data: Partial<Airplane>) => http.post<Airplane>('/api/airplanes', data).then(r => r.data),
  updateAirplane: (id: number, data: Partial<Airplane>) => http.put<Airplane>(`/api/airplanes/${id}`, data).then(r => r.data),
  deleteAirplane: (id: number) => http.delete(`/api/airplanes/${id}`).then(r => r.data),
  uploadAirplaneImage: (id: number, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return http.post(`/api/airplanes/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },

  // Flights (GET=Public, POST=ADMIN — NOTE: PUT/DELETE NOT in API_SPEC)
  getFlights: () => http.get<Flight[]>('/api/flights').then(r => r.data),
  getFlightById: (id: number) => http.get<Flight>(`/api/flights/${id}`).then(r => r.data),
  createFlight: (data: Partial<Flight>) => http.post<Flight>('/api/flights', data).then(r => r.data),
  updateFlight: (id: number, data: Partial<Flight>) => http.put<Flight>(`/api/flights/${id}`, data).then(r => r.data),
  deleteFlight: (id: number) => http.delete(`/api/flights/${id}`).then(r => r.data),
  uploadFlightImage: (id: number, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return http.post(`/api/flights/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },

  // Seats (USER/ADMIN)
  getSeats: (flightId?: number) =>
    http.get<Seat[]>(`/api/seats${flightId ? `?flightId=${flightId}` : ''}`).then(r => r.data),
  createSeat: (data: { flightId: number; seatNumber: string }) =>
    http.post<Seat>('/api/seats', data).then(r => r.data),
  checkAvailability: (flightId: number, seatNumber: string) =>
    http.get<boolean>(`/api/seats/availability?flightId=${flightId}&seatNumber=${seatNumber}`).then(r => r.data),
  bookSeat: (id: number) =>
    http.put(`/api/seats/${id}/book`).then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   Passenger — API_SPEC §6.5
   ═══════════════════════════════════════════════════════════ */

export const passengerApi = {
  getMyPassengers: () => http.get<Passenger[]>('/api/passengers/me').then(r => r.data),
  getAllPassengers: () => http.get<Passenger[]>('/api/passengers').then(r => r.data),
  getById: (id: number) => http.get<Passenger>(`/api/passengers/${id}`).then(r => r.data),
  search: (keyword: string) => http.get<Passenger[]>(`/api/passengers/search?keyword=${encodeURIComponent(keyword)}`).then(r => r.data),
  createPassenger: (data: { fullName: string; email?: string; phone?: string; passportNumber?: string }) =>
    http.post<Passenger>('/api/passengers', data).then(r => r.data),
  updatePassenger: (id: number, data: Partial<Passenger>) =>
    http.put<Passenger>(`/api/passengers/${id}`, data).then(r => r.data),
  deletePassenger: (id: number) =>
    http.delete(`/api/passengers/${id}`).then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   Booking — API_SPEC §6.6
   ═══════════════════════════════════════════════════════════ */

export const bookingApi = {
  getAllBookings: () => http.get<Booking[]>('/api/bookings').then(r => r.data),
  getMyBookings: () => http.get<Booking[]>('/api/bookings/me').then(r => r.data),
  getById: (id: number) => http.get<Booking>(`/api/bookings/${id}`).then(r => r.data),
  createBooking: (data: { passengerId: number; flightId: number; seatNumber: string }) =>
    http.post<Booking>('/api/bookings', data).then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   Payment — API_SPEC §6.7
   ═══════════════════════════════════════════════════════════ */

export const paymentApi = {
  getAllPayments: () => http.get<Payment[]>('/api/payments').then(r => r.data),
  getMyPayments: () => http.get<Payment[]>('/api/payments/me').then(r => r.data),
  getByBooking: (bookingId: number) => http.get<Payment>(`/api/payments/booking/${bookingId}`).then(r => r.data),
  simulateSuccess: (id: number) => http.post<Payment>(`/api/payments/${id}/simulate-success`).then(r => r.data),
  simulateFail: (id: number) => http.post<Payment>(`/api/payments/${id}/simulate-fail`).then(r => r.data),
  pay: (id: number) => http.put<Payment>(`/api/payments/${id}/pay`).then(r => r.data),
  fail: (id: number) => http.put<Payment>(`/api/payments/${id}/fail`).then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   Ticket — API_SPEC §6.8
   ═══════════════════════════════════════════════════════════ */

export const ticketApi = {
  getAllTickets: () => http.get<Ticket[]>('/api/tickets').then(r => r.data),
  getMyTickets: () => http.get<Ticket[]>('/api/tickets/me').then(r => r.data),
  getByBooking: (bookingId: number) => http.get<Ticket[]>(`/api/tickets/booking/${bookingId}`).then(r => r.data),
  getByPassenger: (passengerId: number) => http.get<Ticket[]>(`/api/tickets/passenger/${passengerId}`).then(r => r.data),
  getByCode: (code: string) => http.get<Ticket>(`/api/tickets/code/${code}`).then(r => r.data),
};

/* ═══════════════════════════════════════════════════════════
   Checkin — API_SPEC §6.9
   ═══════════════════════════════════════════════════════════ */

export const checkinApi = {
  getAllCheckins: () => http.get<Checkin[]>('/api/checkins').then(r => r.data),
  getMyCheckins: () => http.get<Checkin[]>('/api/checkins/me').then(r => r.data),
  createCheckin: (ticketCode: string) => http.post<Checkin>('/api/checkins', { ticketCode }).then(r => r.data),
  getByTicket: (ticketCode: string) => http.get<Checkin>(`/api/checkins/ticket/${ticketCode}`).then(r => r.data),
};
