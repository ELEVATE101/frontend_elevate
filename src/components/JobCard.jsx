import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

// Reusable card for public job browsing and employer job management.
// The optional actions prop lets pages add edit/delete/applicant buttons.
const JobCard = ({ job, actions }) => (
  <div className="card job-card h-100">
    <div className="card-body d-flex flex-column">
      <div className="d-flex justify-content-between gap-3 mb-2">
        <div>
          <h5 className="card-title mb-1">{job.title}</h5>
          <div className="text-secondary small">{job.company_name || job.employer_name}</div>
        </div>
        {job.status && <StatusBadge status={job.status} />}
      </div>
      <div className="d-flex flex-wrap gap-2 small text-secondary mb-3">
        <span>{job.location}</span>
        <span>•</span>
        <span>{job.job_type}</span>
        {job.salary_range && (
          <>
            <span>•</span>
            <span>{job.salary_range}</span>
          </>
        )}
      </div>
      <p className="card-text text-secondary flex-grow-1">{job.description?.slice(0, 160)}...</p>
      <div className="d-flex flex-wrap gap-2">
        <Link className="btn btn-primary btn-sm" to={`/jobs/${job.id}`}>
          View Details
        </Link>
        {actions}
      </div>
    </div>
  </div>
);

export default JobCard;
