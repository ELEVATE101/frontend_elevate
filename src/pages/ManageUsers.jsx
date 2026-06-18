import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import { roleLabel } from '../utils/roleRoutes';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = () => {
    // Admin endpoint returns public user fields without password hashes.
    setLoading(true);
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err.response?.data?.message || 'Could not load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateStatus = async (id, status) => {
    // Toggle between active and inactive. The backend prevents self-deactivation.
    setMessage('');
    setError('');
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      setMessage('User status updated');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="card">
      <div className="card-body">
        <h1 className="h3 mb-3">Manage Users</h1>
        <AlertMessage type="success" message={message} />
        <AlertMessage message={error} />
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{roleLabel(item.role)}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => updateStatus(item.id, item.status === 'active' ? 'inactive' : 'active')}
                    >
                      {item.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
