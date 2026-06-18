import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stats come from count queries on the backend.
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="h3 mb-3">Admin Dashboard</h1>
      <div className="row g-3">
        {Object.entries(stats || {}).map(([key, value]) => (
          <div className="col-6 col-xl-4" key={key}>
            <div className="stat-card">
              <span>{key.replaceAll('_', ' ')}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
