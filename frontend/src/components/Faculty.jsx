import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Faculty = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('Computer Architecture');
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('50');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(savedUser);
    if (user.role !== 'Faculty' && user.role !== 'Admin') {
      setError('Access Denied: You do not have faculty evaluation privileges.');
      return;
    }

    // Fetch student rosters for selection
    axios.get('http://localhost:5000/api/faculty/students')
      .then(res => setStudents(res.data))
      .catch(err => setError('Failed to fetch college student records.'));
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!selectedStudent || !obtainedMarks) {
      alert('Please fill out all marks entry parameters.');
      return;
    }

    const marksPackage = {
      userId: selectedStudent,
      subject,
      obtainedMarks: parseInt(obtainedMarks),
      maxMarks: parseInt(maxMarks)
    };

    axios.post('http://localhost:5000/api/faculty/marks', marksPackage)
      .then(res => {
        setMessage('📊 ' + res.data.message);
        setObtainedMarks('');
      })
      .catch(err => alert('Failed to record student performance tracking details.'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (error) return <div style={styles.error}>{error} <br/><Link to="/dashboard">Back to Hub</Link></div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Faculty Assessment Portal</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/dashboard" style={styles.backBtn}>Back to Main Hub</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={styles.card}>
        <h3>Enter Student Academic Scores</h3>
        {message && <div style={styles.successBadge}>{message}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Select Student Profiles:</label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} style={styles.input}>
            <option value="">-- Choose Active Student --</option>
            {students.map(std => (
              <option key={std.id} value={std.id}>{std.name} ({std.email})</option>
            ))}
          </select>

          <label style={styles.label}>Course / Subject Domain:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={styles.input}>
            <option value="Computer Architecture">Computer Architecture</option>
            <option value="Compiler Design">Compiler Design</option>
            <option value="Reinforcement Learning">Reinforcement Learning</option>
            <option value="Java Programming">Java Programming</option>
          </select>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Obtained Marks:</label>
              <input type="number" value={obtainedMarks} onChange={(e) => setObtainedMarks(e.target.value)} placeholder="e.g. 45" style={styles.input} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Max Weightage:</label>
              <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} style={styles.input} disabled />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>Submit Assessment Sheet</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f4f6f9', padding: '30px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', margin: '0 auto 20px auto' },
  backBtn: { textDecoration: 'none', color: '#1a73e8', fontWeight: 'bold', fontSize: '15px' },
  logoutBtn: { backgroundColor: '#ea4335', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#3c4043' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #dadce0', fontSize: '15px', width: '100%', boxSizing: 'border-box' },
  submitBtn: { backgroundColor: '#1a73e8', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' },
  successBadge: { padding: '12px', backgroundColor: '#e6f4ea', color: '#137333', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' },
  error: { padding: '50px', color: '#c5221f', textAlign: 'center', fontSize: '18px', fontFamily: 'Arial' }
};

export default Faculty;