import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initial state is restored from localStorage so refreshes keep the user logged in.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('elevate_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('elevate_token')));

  useEffect(() => {
    // On first load, verify the token with the backend before trusting it.
    const token = localStorage.getItem('elevate_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('elevate_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('elevate_token');
        localStorage.removeItem('elevate_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    // The backend returns both the public user object and the JWT.
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('elevate_token', res.data.token);
    localStorage.setItem('elevate_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    // New users are logged in immediately after registration.
    const res = await api.post('/auth/register', payload);
    localStorage.setItem('elevate_token', res.data.token);
    localStorage.setItem('elevate_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    // Logout is client-side because JWTs are stateless in this simple project.
    localStorage.removeItem('elevate_token');
    localStorage.removeItem('elevate_user');
    setUser(null);
  };

  // ============= CRUD OPERATIONS =============
  // These are helper functions for managing data across the app

  // ===== CREATE (POST) =====
  // Create a new job
  const createJob = async (jobData) => {
    const res = await api.post('/jobs', jobData);
    return res.data;
  };

  // Create a new application
  const createApplication = async (jobId, formData) => {
    const res = await api.post(`/applications/apply/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  };

  // ===== READ (GET) =====
  // Get all jobs (public)
  const getAllJobs = async () => {
    const res = await api.get('/jobs');
    return res.data;
  };

  // Get one job by ID
  const getJobById = async (jobId) => {
    const res = await api.get(`/jobs/${jobId}`);
    return res.data;
  };

  // Get current employer's jobs
  const getMyJobs = async () => {
    const res = await api.get('/jobs/employer/my-jobs');
    return res.data;
  };

  // Get user's own applications
  const getMyApplications = async () => {
    const res = await api.get('/applications/my-applications');
    return res.data;
  };

  // Get applicants for a specific job (employer only)
  const getJobApplicants = async (jobId) => {
    const res = await api.get(`/applications/job/${jobId}`);
    return res.data;
  };

  // Get user profile
  const getUserProfile = async () => {
    const res = await api.get('/profile');
    return res.data;
  };

  // ===== UPDATE (PUT) =====
  // Update a job
  const updateJob = async (jobId, jobData) => {
    const res = await api.put(`/jobs/${jobId}`, jobData);
    return res.data;
  };

  // Update employer profile
  const updateEmployerProfile = async (profileData) => {
    const res = await api.put('/profile/employer', profileData);
    return res.data;
  };

  // Update job seeker profile (with CV file upload)
  const updateJobSeekerProfile = async (profileData) => {
    const res = await api.put('/profile/job-seeker', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setUser(res.data.user);
    localStorage.setItem('elevate_user', JSON.stringify(res.data.user));
    return res.data;
  };

  // Update application status (employer/admin only)
  const updateApplicationStatus = async (applicationId, status) => {
    const res = await api.put(`/applications/${applicationId}/status`, { status });
    return res.data;
  };

  // Delete a job seeker from a job application (employer/admin only)
  const deleteJobSeeker = async (applicationId) => {
    const res = await api.delete(`/applications/${applicationId}/job-seeker`);
    return res.data;
  };

  // ===== DELETE =====
  // Delete a job
  const deleteJob = async (jobId) => {
    const res = await api.delete(`/jobs/${jobId}`);
    return res.data;
  };

  const value = useMemo(
    // useMemo avoids recreating the context value unless user/loading changes.
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      // CRUD helpers
      createJob,
      createApplication,
      getAllJobs,
      getJobById,
      getMyJobs,
      getMyApplications,
      getJobApplicants,
      getUserProfile,
      updateJob,
      updateEmployerProfile,
      updateJobSeekerProfile,
      updateApplicationStatus,
      deleteJobSeeker,
      deleteJob
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
