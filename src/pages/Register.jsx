import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardFor } from '../utils/roleRoutes';
import AlertMessage from '../components/AlertMessage';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'job_seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      // The backend creates the user, hashes the password, and returns a JWT.
      const user = await register(form);
      navigate(dashboardFor(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3">Create Account</h1>
        <AlertMessage message={error} />
        <label className="form-label">Full name</label>
        <input
          className="form-control mb-3"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          minLength="6"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <label className="form-label">Account type</label>
        <select
          className="form-select mb-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-secondary small mt-3 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
