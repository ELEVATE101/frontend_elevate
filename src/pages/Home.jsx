import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load a few open jobs for the landing page preview.
    api
      .get('/jobs')
      .then((res) => setJobs(res.data.jobs.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* Public landing section. It links users directly to the main workflows. */}
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <p className="text-primary fw-semibold mb-2">JobConnect</p>
              <h1 className="display-5 fw-bold mb-3">Find talent and career opportunities in one focused workspace.</h1>
              <p className="lead text-secondary mb-4">
                Employers can post openings and manage applicants while job seekers build profiles,
                upload CVs, apply for roles, and track every application.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  Browse Jobs
                </Link>
                <Link to="/register" className="btn btn-outline-primary btn-lg">
                  Create Account
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-panel">
                <div className="metric-row">
                  <span>Open roles</span>
                  <strong>{jobs.length}+</strong>
                </div>
                <div className="metric-row">
                  <span>Role-based dashboards</span>
                  <strong>3</strong>
                </div>
                <div className="metric-row">
                  <span>Application tracking</span>
                  <strong>Live</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Recent jobs reuse the same JobCard component used by the browse page. */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Recent Openings</h2>
          <Link to="/jobs" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="row g-3">
            {jobs.map((job) => (
              <div className="col-md-4" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
