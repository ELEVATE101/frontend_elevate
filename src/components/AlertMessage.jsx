const AlertMessage = ({ type = 'danger', message }) => {
  // Returning null means React renders nothing when there is no message.
  if (!message) return null;
  return <div className={`alert alert-${type} py-2`}>{message}</div>;
};

export default AlertMessage;
