import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { uploadUrl } from '../services/api';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const ViewApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadApplications = () => {
    // The backend checks that this employer owns the job.
    setLoading(true);
    api
      .get(`/applications/job/${id}`)
      .then((res) => setApplications(res.data.applications))
      .catch((err) => setError(err.response?.data?.message || 'Could not load applicants'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, [id]);

  const updateStatus = async (applicationId, status) => {
    // Employers update candidates through the controlled status list.
    setMessage('');
    setError('');
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      setMessage('Application status updated');
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="card">
      <div className="card-body">
        <h1 className="h3 mb-3">Applicants</h1>
        <AlertMessage type="success" message={message} />
        <AlertMessage message={error} />
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Skills</th>
                <th>CV</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.job_seeker_name}</strong>
                    <div className="small text-secondary">{app.experience_level}</div>
                  </td>
                  <td>
                    {app.job_seeker_email}
                    <div className="small text-secondary">{app.phone}</div>
                  </td>
                  <td className="table-text">{app.skills}</td>
                  <td><a href={uploadUrl(app.cv_file)} target="_blank" rel="noreferrer">View CV</a></td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <select className="form-select form-select-sm" value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}>
                      <option>Pending</option>
                      <option>Shortlisted</option>
                      <option>Rejected</option>
                      <option>Hired</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!applications.length && <tr><td colSpan="6" className="text-secondary">No applicants yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
