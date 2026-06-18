import axios from 'axios';

// A single Axios instance keeps the API base URL and auth behavior in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Before every request, attach the saved JWT if the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Convert an uploaded filename from the database into a browser URL.
export const uploadUrl = (fileName) => {
  if (!fileName) return '';
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiBase.replace('/api', '')}/uploads/${fileName}`;
};

export default api;
