import { useEffect, useMemo, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import FlightDetailPage from './pages/FlightDetailPage'
import FlightsPage from './pages/FlightsPage'
import BookingFailedPage from './pages/BookingFailedPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import CheckinPage from './pages/CheckinPage'
import MyTicketsPage from './pages/MyTicketsPage'
import PassengerInfoPage from './pages/PassengerInfoPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import TicketDetailPage from './pages/TicketDetailPage'

type RouteKey =
  | 'flights'
  | 'flight-detail'
  | 'seat-selection'
  | 'passenger-info'
  | 'payment'
  | 'booking-failed'
  | 'booking-success'
  | 'tickets'
  | 'ticket-detail'
  | 'profile'
  | 'checkin'
  | 'support'

function readRoute(): RouteKey {
  const hash = window.location.hash.replace('#/', '')
  if (
    hash === 'flight-detail' ||
    hash === 'seat-selection' ||
    hash === 'passenger-info' ||
    hash === 'payment' ||
    hash === 'booking-failed' ||
    hash === 'booking-success' ||
    hash === 'tickets' ||
    hash === 'ticket-detail' ||
    hash === 'profile' ||
    hash === 'checkin' ||
    hash === 'support'
  ) return hash
  return 'flights'
}

function App() {
  const [route, setRoute] = useState<RouteKey>(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) window.location.hash = '/flights'
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const page = useMemo(() => {
    if (route === 'flights') return <FlightsPage />
    if (route === 'flight-detail') return <FlightDetailPage />
    if (route === 'seat-selection') return <SeatSelectionPage />
    if (route === 'passenger-info') return <PassengerInfoPage />
    if (route === 'payment') return <PaymentPage />
    if (route === 'booking-failed') return <BookingFailedPage />
    if (route === 'booking-success') return <BookingSuccessPage />
    if (route === 'tickets') return <MyTicketsPage />
    if (route === 'ticket-detail') return <TicketDetailPage />
    if (route === 'profile') return <ProfilePage />
    if (route === 'checkin') return <CheckinPage />
    return (
      <main className="pt-24 min-h-[60vh] max-w-container-max mx-auto px-margin-desktop">
        <h1 className="font-h2 text-h2 text-primary mb-4">{route.toUpperCase()}</h1>
        <p className="text-on-surface-variant">Trang đang được phát triển.</p>
      </main>
    )
  }, [route])

  return (
    <>
      <Header active={route === 'flight-detail' || route === 'seat-selection' || route === 'passenger-info' || route === 'payment' || route === 'booking-failed' || route === 'booking-success' ? 'flights' : route === 'ticket-detail' || route === 'profile' ? 'tickets' : route} />
      {page}
      <Footer />
    </>
  )
}

export default App
