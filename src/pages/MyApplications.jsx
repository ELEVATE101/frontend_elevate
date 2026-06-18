import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The backend filters by req.user.id, so users cannot see other seekers' applications.
    api
      .get('/applications/my-applications')
      .then((res) => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="card">
      <div className="card-body">
        <h1 className="h3 mb-3">My Applications</h1>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.job_title}</td>
                  <td>{app.company_name}</td>
                  <td>{String(app.applied_at).slice(0, 10)}</td>
                  <td><StatusBadge status={app.status} /></td>
                </tr>
              ))}
              {!applications.length && <tr><td colSpan="4" className="text-secondary">No applications found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
