import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://college-management-system-uk0d.onrender.com/api/auth/login', formData);
      setMessage(response.data.message);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication pipeline failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Sign in to your dashboard instance</p>

        {message && <div style={styles.successAlert}>⚡ {message}</div>}
        {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Institutional Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="name@college.edu" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              style={styles.input} 
              required 
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          >
            Authenticate Profile
          </button>
          
          <p style={styles.redirectText}>
            New to the system?{' '}
            <Link to="/register" style={styles.redirectLink}>
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: '"Inter", sans-serif', padding: '20px' },
  card: { backgroundColor: '#1e293b', padding: '45px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '100%', maxWidth: '420px', border: '1px solid #334155' },
  heading: { margin: '0 0 8px 0', color: '#f8fafc', fontSize: '26px', fontWeight: '700', textAlign: 'center' },
  subheading: { margin: '0 0 28px 0', color: '#94a3b8', fontSize: '14px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#cbd5e1', letterSpacing: '0.3px' },
  input: { padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '14px', outline: 'none', transition: 'all 0.2s ease' },
  button: { padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600', marginTop: '10px', transition: 'all 0.2s ease' },
  successAlert: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.3)' },
  redirectText: { marginTop: '16px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' },
  redirectLink: { color: '#818cf8', fontWeight: '600', textDecoration: 'none' }
};

export default Login;