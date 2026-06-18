import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';

const blank = {
  // Defaults used when creating a new job.
  title: '',
  description: '',
  requirements: '',
  responsibilities: '',
  location: '',
  job_type: 'Full-time',
  salary_range: '',
  deadline: '',
  status: 'open'
};

const JobForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit') return;
    // In edit mode, load the current job and prefill the form.
    api
      .get(`/jobs/${id}`)
      .then((res) => {
        setForm({
          title: res.data.job.title || '',
          description: res.data.job.description || '',
          requirements: res.data.job.requirements || '',
          responsibilities: res.data.job.responsibilities || '',
          location: res.data.job.location || '',
          job_type: res.data.job.job_type || 'Full-time',
          salary_range: res.data.job.salary_range || '',
          deadline: String(res.data.job.deadline || '').slice(0, 10),
          status: res.data.job.status || 'open'
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load job'))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Same component handles both create and edit; mode chooses the endpoint.
      if (mode === 'edit') {
        await api.put(`/jobs/${id}`, form);
      } else {
        await api.post('/jobs', form);
      }
      navigate('/employer/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="card-body">
        <h1 className="h3 mb-3">{mode === 'edit' ? 'Edit Job' : 'Post a New Job'}</h1>
        <AlertMessage message={error} />
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Title</label>
            <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Job type</label>
            <select className="form-select" value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Location</label>
            <input className="form-control" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Salary range</label>
            <input className="form-control" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Deadline</label>
            <input className="form-control" type="date" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          {mode === 'edit' && (
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="open">open</option>
                <option value="closed">closed</option>
              </select>
            </div>
          )}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="5" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Responsibilities</label>
            <textarea className="form-control" rows="5" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Requirements</label>
            <textarea className="form-control" rows="5" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary mt-3" disabled={saving}>
          {saving ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
