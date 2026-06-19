import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

// ============================================================================
// JOB MARKETPLACE CRUD SYSTEM
// ============================================================================
// This component demonstrates all four CRUD operations:
// - CREATE: Post a new job (JobForm.jsx)
// - READ: Display employer's jobs (below)
// - UPDATE: Edit job details (JobForm.jsx)
// - DELETE: Remove job posting (below)
// ============================================================================

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ========= READ OPERATION =========
  // GET /api/jobs/employer/my-jobs
  // Fetches all jobs posted by the currently logged-in employer
  const loadJobs = () => {
    setLoading(true);
    api
      .get('/jobs/employer/my-jobs')
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => setError(err.response?.data?.message || 'Could not load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // ========= DELETE OPERATION =========
  // DELETE /api/jobs/:id
  // Removes a job posting permanently from the database
  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    setMessage('');
    setError('');
    try {
      await api.delete(`/jobs/${id}`);
      setMessage('✓ Job successfully deleted');
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete job');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {/* HEADER with CREATE button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">My Jobs</h1>
          <p className="text-secondary small mt-1">Manage your job postings</p>
        </div>
        {/* ========= CREATE OPERATION =========
            POST /api/jobs (in JobForm.jsx)
            Clicking this button opens a form to create a new job posting
        */}
        <Link className="btn btn-primary" to="/employer/jobs/new">
          + Post New Job
        </Link>
      </div>

      {/* Success/Error Messages */}
      <AlertMessage type="success" message={message} />
      <AlertMessage message={error} />

      {/* Job List */}
      <div className="row g-3">
        {jobs.map((job) => (
          <div className="col-xl-6" key={job.id}>
            <JobCard
              job={job}
              actions={
                <div className="btn-group btn-group-sm w-100" role="group">
                  {/* ========= UPDATE OPERATION =========
                      PUT /api/jobs/:id (in JobForm.jsx with mode='edit')
                      Opens JobForm.jsx in edit mode to update job details
                  */}
                  <Link 
                    className="btn btn-outline-primary" 
                    to={`/employer/jobs/${job.id}/edit`}
                    title="Edit job title, description, salary, etc."
                  >
                    ✏️ Edit
                  </Link>

                  {/* View Applicants */}
                  <Link 
                    className="btn btn-outline-secondary" 
                    to={`/employer/jobs/${job.id}/applicants`}
                    title="See who applied for this job"
                  >
                    👥 Applicants
                  </Link>

                  {/* ========= DELETE OPERATION =========
                      DELETE /api/jobs/:id
                      Permanently removes the job posting from the database
                  */}
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={() => deleteJob(job.id)}
                    title="Delete this job posting permanently"
                  >
                    🗑️ Delete
                  </button>
                </div>
              }
            />
          </div>
        ))}
        {!jobs.length && (
          <div className="col-12">
            <div className="alert alert-info">
              📭 No jobs posted yet. <Link to="/employer/jobs/new">Post your first job</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
