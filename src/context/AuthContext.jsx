import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initial state is restored from localStorage so refreshes keep the user logged in.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('jobconnect_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('jobconnect_token')));

  useEffect(() => {
    // On first load, verify the token with the backend before trusting it.
    const token = localStorage.getItem('jobconnect_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('jobconnect_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    // The backend returns both the public user object and the JWT.
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('jobconnect_token', res.data.token);
    localStorage.setItem('jobconnect_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    // New users are logged in immediately after registration.
    const res = await api.post('/auth/register', payload);
    localStorage.setItem('jobconnect_token', res.data.token);
    localStorage.setItem('jobconnect_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    // Logout is client-side because JWTs are stateless in this simple project.
    localStorage.removeItem('jobconnect_token');
    localStorage.removeItem('jobconnect_user');
    setUser(null);
  };

  const value = useMemo(
    // useMemo avoids recreating the context value unless user/loading changes.
    () => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
