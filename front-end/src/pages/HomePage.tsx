import { Navigate } from 'react-router-dom';

// Homepage redirects to /flights — the search-first approach per docs
export default function HomePage() {
  return <Navigate to="/flights" replace />;
}
