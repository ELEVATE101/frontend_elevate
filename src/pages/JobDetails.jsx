import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load one job based on the :id route parameter.
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch((err) => setError(err.response?.data?.message || 'Could not load job'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <main className="container py-4"><AlertMessage message={error} /></main>;
  if (!job) return null;

  // Only job seekers are allowed to apply. Other roles can view the public details.
  return (
    <main className="container py-4">
      <div className="job-detail-header mb-4">
        <div>
          <div className="mb-2"><StatusBadge status={job.status} /></div>
          <h1 className="h2 mb-2">{job.title}</h1>
          <p className="text-secondary mb-0">
            {job.company_name || job.employer_name} · {job.location} · {job.job_type}
          </p>
        </div>
        <div className="text-lg-end">
          <div className="fw-semibold">{job.salary_range || 'Salary not specified'}</div>
          <div className="small text-secondary mb-3">Deadline: {String(job.deadline).slice(0, 10)}</div>
          {user?.role === 'job_seeker' ? (
            <Link className="btn btn-primary" to={`/jobs/${job.id}/apply`}>
              Apply Now
            </Link>
          ) : !user ? (
            <Link className="btn btn-primary" to="/login">
              Login to Apply
            </Link>
          ) : null}
        </div>
      </div>
      <div className="row g-4">
        <section className="col-lg-8">
          <h2 className="h5">Description</h2>
          <p className="preline">{job.description}</p>
          <h2 className="h5 mt-4">Responsibilities</h2>
          <p className="preline">{job.responsibilities || 'Not specified'}</p>
          <h2 className="h5 mt-4">Requirements</h2>
          <p className="preline">{job.requirements || 'Not specified'}</p>
        </section>
        <aside className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="h6">Company</h3>
              <p className="mb-1 fw-semibold">{job.company_name || job.employer_name}</p>
              <p className="text-secondary small mb-2">{job.industry || 'Industry not specified'}</p>
              {job.website && (
                <a href={job.website} target="_blank" rel="noreferrer">
                  {job.website}
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default JobDetails;
