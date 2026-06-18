import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', location: '', job_type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    // Query params are sent to the backend so filtering happens in SQL.
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/jobs', { params: filters });
      setJobs(res.data.jobs);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSubmit = (event) => {
    // Prevent the browser from reloading the page when the search form is submitted.
    event.preventDefault();
    loadJobs();
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h3 mb-1">Browse Jobs</h1>
          <p className="text-secondary mb-0">Search open roles by keyword, company, location, or job type.</p>
        </div>
      </div>
      <form className="filter-bar mb-4" onSubmit={handleSubmit}>
        <input
          className="form-control"
          placeholder="Title, company, or keyword"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          className="form-select"
          value={filters.job_type}
          onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
        >
          <option value="">Any type</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>
        <button className="btn btn-primary">Search</button>
      </form>
      <AlertMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div className="col-md-6 col-xl-4" key={job.id}>
              <JobCard job={job} />
            </div>
          ))}
          {!jobs.length && <p className="text-secondary">No open jobs match your search.</p>}
        </div>
      )}
    </main>
  );
};

export default BrowseJobs;
