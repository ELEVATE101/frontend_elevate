import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardFor, roleLabel } from '../utils/roleRoutes';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the auth context and send the user back to the public home page.
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          JobConnect
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/jobs">
                Browse Jobs
              </NavLink>
            </li>
            {user && (
              // The dashboard link changes based on the logged-in user's role.
              <li className="nav-item">
                <NavLink className="nav-link" to={dashboardFor(user.role)}>
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex gap-2 align-items-center">
            {user ? (
              // Logged-in users see identity and logout controls.
              <>
                <span className="small text-secondary d-none d-md-inline">
                  {user.name} · {roleLabel(user.role)}
                </span>
                <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              // Visitors see login and registration actions.
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
