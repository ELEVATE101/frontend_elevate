import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for AuthProvider to finish checking the saved token.
  if (loading) return <Loading />;
  // Unauthenticated users are sent to login and the attempted URL is preserved.
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  // Authenticated users still need the correct role for role-specific pages.
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  // Outlet renders the child route that matched inside this protected group.
  return <Outlet />;
};

export default ProtectedRoute;
