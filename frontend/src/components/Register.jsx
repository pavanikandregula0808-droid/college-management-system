import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
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
      const response = await axios.post('https://college-management-system-uk0d.onrender.com/api/auth/register', formData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration structural check failed. Please check your data fields.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create System Account</h2>
        <p style={styles.subheading}>Register your identity variables below</p>

        {message && <div style={styles.successAlert}>✨ {message}</div>}
        {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Nomenclature Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Mercer" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>College Network Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="alex.mercer@college.edu" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password Hash Token</label>
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>System Access Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              style={styles.select}
            >
              <option value="student">Student Account Node</option>
              <option value="faculty">Faculty Academic Operator</option>
              <option value="admin">Global Root Administrator</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Provision New Profile
          </button>

          <p style={styles.redirectText}>
            Already verified?{' '}
            <Link to="/login" style={styles.redirectLink}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: '"Inter", sans-serif', padding: '20px' },
  card: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '100%', maxWidth: '420px', border: '1px solid #334155' },
  heading: { margin: '0 0 8px 0', color: '#f8fafc', fontSize: '26px', fontWeight: '700', textAlign: 'center' },
  subheading: { margin: '0 0 28px 0', color: '#94a3b8', fontSize: '14px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#cbd5e1' },
  input: { padding: '11px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '14px', outline: 'none' },
  select: { padding: '11px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' },
  button: { padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600', marginTop: '10px', transition: 'all 0.2s ease' },
  successAlert: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.3)' },
  redirectText: { marginTop: '16px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' },
  redirectLink: { color: '#6ee7b7', fontWeight: '600', textDecoration: 'none' }
};

export default Register;