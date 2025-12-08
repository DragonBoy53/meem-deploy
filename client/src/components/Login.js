
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="product-section">
      <h2 className="section-title">Login</h2>
      <form
        style={{ maxWidth: 360, marginTop: 16 }}
        onSubmit={handleSubmit}
      >
        <label style={{ display: 'block', marginBottom: 8 }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        {error && (
          <p className="muted-text" style={{ color: '#dc2626', marginBottom: 8 }}>
            {error}
          </p>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="muted-text" style={{ marginTop: 12 }}>
          Don&apos;t have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
