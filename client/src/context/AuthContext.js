
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('meem_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const saveAuth = (userData, token) => {
    setUser(userData);
    localStorage.setItem('meem_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('meem_token', token);
    }
  };

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('meem_user');
    localStorage.removeItem('meem_token');
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      saveAuth(res.data.user, res.data.token);
      return { success: true };
    } catch (err) {
      console.error('Register failed:', err?.response?.data || err.message);
      const message =
        err?.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      saveAuth(res.data.user, res.data.token);
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err?.response?.data || err.message);
      const message = err?.response?.data?.message || 'Login failed. Try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await axios.put('/auth/me', updates);
      saveAuth(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Update profile failed:', err?.response?.data || err.message);
      const message =
        err?.response?.data?.message || 'Update failed. Try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem('meem_token');
    if (!token || user) return;

    (async () => {
      try {
        const res = await axios.get('/auth/me');
        saveAuth(res.data.user);
      } catch (err) {
        console.error('Auth check failed:', err?.response?.data || err.message);
        clearAuth();
      }
    })();
  
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
