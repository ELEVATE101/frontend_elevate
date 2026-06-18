// Bootstrap badge colors mapped to each status value used by the backend.
const statusClass = {
  open: 'success',
  closed: 'secondary',
  active: 'success',
  inactive: 'secondary',
  Pending: 'warning',
  Shortlisted: 'primary',
  Rejected: 'danger',
  Hired: 'success'
};

const StatusBadge = ({ status }) => (
  <span className={`badge text-bg-${statusClass[status] || 'secondary'}`}>{status}</span>
);

export default StatusBadge;
