import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Show the job summary above the application form.
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch((err) => setError(err.response?.data?.message || 'Could not load job'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    // FormData lets the seeker include a CV override for this application.
    const data = new FormData();
    data.append('cover_letter', coverLetter);
    if (cv) data.append('cv', cv);
    try {
      await api.post(`/applications/apply/${id}`, data);
      navigate('/job-seeker/applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="container py-4">
      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="card-body">
          <Link to={`/jobs/${id}`} className="small">Back to job</Link>
          <h1 className="h3 mt-2">Apply for {job?.title}</h1>
          <p className="text-secondary">{job?.company_name}</p>
          <AlertMessage message={error} />
          <label className="form-label">Cover letter</label>
          <textarea
            className="form-control mb-3"
            rows="8"
            required
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <label className="form-label">CV override</label>
          <input
            className="form-control mb-3"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCv(e.target.files[0])}
          />
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ApplyJob;
