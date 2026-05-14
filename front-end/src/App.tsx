import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FlightsListPage from './pages/FlightsListPage';
import FlightDetailPage from './pages/FlightDetailPage';
import ProfilePage from './pages/ProfilePage';
import BookingNewPage from './pages/BookingNewPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyPassengersPage from './pages/MyPassengersPage';
import MyPaymentsPage from './pages/MyPaymentsPage';
import MyTicketsPage from './pages/MyTicketsPage';
import CheckinPage from './pages/CheckinPage';

import DashboardPage from './pages/admin/DashboardPage';
import AdminAirportsPage from './pages/admin/AdminAirportsPage';
import AdminFlightsPage from './pages/admin/AdminFlightsPage';
import AdminAirplanesPage from './pages/admin/AdminAirplanesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminSeatsPage from './pages/admin/AdminSeatsPage';
import AdminPassengersPage from './pages/admin/AdminPassengersPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import AdminCheckinsPage from './pages/admin/AdminCheckinsPage';

import { AuthProvider } from './lib/auth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ToastProvider } from './components/ui/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* User App — B2C layout */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<HomePage />} />
              <Route path="flights" element={<FlightsListPage />} />
              <Route path="flights/:id" element={<FlightDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Protected user routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="my-passengers" element={<MyPassengersPage />} />
                <Route path="bookings/new" element={<BookingNewPage />} />
                <Route path="my-bookings" element={<MyBookingsPage />} />
                <Route path="my-payments" element={<MyPaymentsPage />} />
                <Route path="my-tickets" element={<MyTicketsPage />} />
                <Route path="checkin" element={<CheckinPage />} />
              </Route>
            </Route>

            {/* Admin App — B2B SaaS dashboard layout */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="airports" element={<AdminAirportsPage />} />
                <Route path="airplanes" element={<AdminAirplanesPage />} />
                <Route path="flights" element={<AdminFlightsPage />} />
                <Route path="seats" element={<AdminSeatsPage />} />
                <Route path="passengers" element={<AdminPassengersPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="tickets" element={<AdminTicketsPage />} />
                <Route path="checkins" element={<AdminCheckinsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastProvider />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
