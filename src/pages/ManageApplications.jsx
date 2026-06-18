import { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admins can view all applications across jobs and companies.
    api
      .get('/admin/applications')
      .then((res) => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="card">
      <div className="card-body">
        <h1 className="h3 mb-3">Manage Applications</h1>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Company</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    {app.job_seeker_name}
                    <div className="small text-secondary">{app.job_seeker_email}</div>
                  </td>
                  <td>{app.job_title}</td>
                  <td>{app.company_name}</td>
                  <td>{String(app.applied_at).slice(0, 10)}</td>
                  <td><StatusBadge status={app.status} /></td>
                </tr>
              ))}
              {!applications.length && <tr><td colSpan="5" className="text-secondary">No applications found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
