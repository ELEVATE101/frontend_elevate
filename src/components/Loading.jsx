// Shared loading indicator used while API requests are in progress.
const Loading = ({ label = 'Loading...' }) => (
  <div className="py-5 text-center text-secondary">
    <div className="spinner-border spinner-border-sm me-2" role="status" />
    {label}
  </div>
);

export default Loading;
