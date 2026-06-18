import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';

const EmployerProfile = () => {
  const [form, setForm] = useState({
    company_name: '',
    company_description: '',
    industry: '',
    location: '',
    phone: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load existing company data so the form can edit it.
    api
      .get('/profile')
      .then((res) => {
        if (res.data.profile) {
          setForm({
            company_name: res.data.profile.company_name || '',
            company_description: res.data.profile.company_description || '',
            industry: res.data.profile.industry || '',
            location: res.data.profile.location || '',
            phone: res.data.profile.phone || '',
            website: res.data.profile.website || ''
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      // PUT performs an upsert on the backend: create if missing, update if present.
      await api.put('/profile/employer', form);
      setMessage('Company profile saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile');
    }
  };

  if (loading) return <Loading />;

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="card-body">
        <h1 className="h3 mb-3">Company Profile</h1>
        <AlertMessage type="success" message={message} />
        <AlertMessage message={error} />
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Company name</label>
            <input className="form-control" required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Industry</label>
            <input className="form-control" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Website</label>
            <input className="form-control" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Company description</label>
            <textarea className="form-control" rows="5" value={form.company_description} onChange={(e) => setForm({ ...form, company_description: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary mt-3">Save Profile</button>
      </div>
    </form>
  );
};

export default EmployerProfile;
