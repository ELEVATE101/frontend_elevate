import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadJobs = () => {
    // Admins can see open and closed jobs for moderation.
    setLoading(true);
    api
      .get('/admin/jobs')
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => setError(err.response?.data?.message || 'Could not load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const removeJob = async (id) => {
    // Removing inappropriate posts uses the shared DELETE /api/jobs/:id endpoint.
    if (!window.confirm('Remove this job post?')) return;
    setMessage('');
    setError('');
    try {
      await api.delete(`/jobs/${id}`);
      setMessage('Job removed');
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove job');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="card">
      <div className="card-body">
        <h1 className="h3 mb-3">Manage Jobs</h1>
        <AlertMessage type="success" message={message} />
        <AlertMessage message={error} />
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.company_name || job.employer_name}</td>
                  <td>{job.location}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeJob(job.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
