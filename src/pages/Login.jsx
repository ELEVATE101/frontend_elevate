import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardFor } from '../utils/roleRoutes';
import AlertMessage from '../components/AlertMessage';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      // AuthContext stores the token/user and returns the logged-in user.
      const user = await login(form.email, form.password);
      // If the user was redirected here from a protected page, send them back there.
      navigate(location.state?.from?.pathname || dashboardFor(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3">Login</h1>
        <AlertMessage message={error} />
        <label className="form-label">Email</label>
        <input
          className="form-control mb-3"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label className="form-label">Password</label>
        <input
          className="form-control mb-3"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-secondary small mt-3 mb-0">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
