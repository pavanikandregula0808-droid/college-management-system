import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' // default dropdown value
  });
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
      // Sending data packet to your backend registration endpoint
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      setMessage(response.data.message);
      // Reset form fields except the role dropdown
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subheading}>Join the College Management System</p>

        {message && <div style={styles.successAlert}>✅ {message}</div>}
        {error && <div style={styles.errorAlert}>❌ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>College Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="example@college.edu" 
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              style={styles.select}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty / Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>Register User</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  heading: { margin: '0 0 10px 0', color: '#1a73e8', fontSize: '24px', fontWeight: 'bold' },
  subheading: { margin: '0 0 20px 0', color: '#5f6368', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#3c4043' },
  input: { padding: '10px 12px', borderRadius: '5px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none' },
  select: { padding: '10px 12px', borderRadius: '5px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' },
  button: { padding: '12px', backgroundColor: '#34a853', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  successAlert: { backgroundColor: '#e6f4ea', color: '#137333', padding: '10px', borderRadius: '5px', fontSize: '14px', marginBottom: '15px', textAlign: 'left' },
  errorAlert: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '5px', fontSize: '14px', marginBottom: '15px', textAlign: 'left' }
};

export default Register;