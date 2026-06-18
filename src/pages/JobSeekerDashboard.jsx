import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const JobSeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dashboard stats are calculated from the user's own applications.
    api
      .get('/applications/my-applications')
      .then((res) => setApplications(res.data.applications))
      .finally(() => setLoading(false));
  }, []);

  // Count applications by status for the summary cards.
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Job Seeker Dashboard</h1>
        <Link className="btn btn-primary" to="/jobs">
          Browse Jobs
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="row g-3 mb-4">
            {['Pending', 'Shortlisted', 'Rejected', 'Hired'].map((status) => (
              <div className="col-6 col-xl-3" key={status}>
                <div className="stat-card">
                  <span>{status}</span>
                  <strong>{counts[status] || 0}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header bg-white fw-semibold">Recent Applications</div>
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id}>
                      <td>{app.job_title}</td>
                      <td>{app.company_name}</td>
                      <td><StatusBadge status={app.status} /></td>
                    </tr>
                  ))}
                  {!applications.length && (
                    <tr><td className="text-secondary">No applications submitted yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobSeekerDashboard;
