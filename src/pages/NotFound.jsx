import { Link } from 'react-router-dom';

// Simple fallback for unknown routes.
const NotFound = () => (
  <main className="container py-5 text-center">
    <h1 className="h3">Page not found</h1>
    <p className="text-secondary">The page you requested does not exist.</p>
    <Link to="/" className="btn btn-primary">
      Go Home
    </Link>
  </main>
);

export default NotFound;
