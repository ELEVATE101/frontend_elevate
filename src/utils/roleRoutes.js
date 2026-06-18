// Central helper so redirects after login/register stay consistent.
export const dashboardFor = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'employer') return '/employer';
  if (role === 'job_seeker') return '/job-seeker';
  return '/jobs';
};

// Convert database role values into user-friendly labels.
export const roleLabel = (role) => {
  if (role === 'job_seeker') return 'Job Seeker';
  if (role === 'employer') return 'Employer';
  if (role === 'admin') return 'Admin';
  return role;
};
