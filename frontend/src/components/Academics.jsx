import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Academics = () => {
  const [academicData, setAcademicData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // Safety Check: If token or user data doesn't exist, kick them back to login
    if (!token || !savedUser) {
      navigate('/login');
      return;
    }

    // Parse the user object from browser storage
    const currentUser = JSON.parse(savedUser);

    // DYNAMIC FETCH: Pass the unique student user id straight to our Express API query
    axios.get(`http://localhost:5000/api/student/academics?userId=${currentUser.id}`)
      .then(res => setAcademicData(res.data))
      .catch(err => setError('Failed to load academic records from database.'));
  }, [navigate]);

  if (error) return <div style={styles.error}>{error}</div>;
  if (!academicData) return <div style={styles.loading}>Loading academic records...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Academic Performance Dashboard</h2>
        <Link to="/dashboard" style={styles.backBtn}>Back to Main Hub</Link>
      </header>

      <div style={styles.mainGrid}>
        {/* Attendance & GPA Summary Cards */}
        <div style={styles.summaryRow}>
          <div style={styles.card}>
            <h3>Semester Attendance</h3>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${academicData.attendance}%`, backgroundColor: academicData.attendance >= 75 ? '#0f9d58' : '#ea4335' }}></div>
            </div>
            <p style={styles.cardValue}>{academicData.attendance}% Status</p>
            <small>{academicData.attendance >= 75 ? '✅ Attendance criteria met.' : '❌ Warning: Below 75% requirement.'}</small>
          </div>

          <div style={styles.card}>
            <h3>Current Cumulative GPA</h3>
            <p style={{ ...styles.cardValue, fontSize: '36px', color: '#1a73e8' }}>{academicData.gpa} / 10</p>
            <p style={styles.subtext}>Based on verified semester evaluation sheets.</p>
          </div>
        </div>

        {/* Internal Examination Marks Table */}
        <div style={styles.card}>
          <h3>Internal Assessment Performance</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Subject / Course</th>
                <th style={styles.th}>Obtained Marks</th>
                <th style={styles.th}>Maximum Weightage</th>
                <th style={styles.th}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {academicData.internals.map((item, idx) => (
                <tr key={idx} style={styles.tableRow}>
                  <td style={styles.td}><strong>{item.subject}</strong></td>
                  <td style={styles.td}>{item.obtainedMarks}</td>
                  <td style={styles.td}>{item.maxMarks}</td>
                  <td style={styles.td}>{((item.obtainedMarks / item.maxMarks) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Coursework / Assignments */}
        <div style={styles.card}>
          <h3>Coursework & Active Assignments</h3>
          <ul style={styles.list}>
            {academicData.assignments.map((task) => (
              <li key={task.id} style={styles.listItem}>
                <div>
                  <strong>{task.title}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#5f6368' }}>Due Date: {task.dueDate}</p>
                </div>
                <span style={{ ...styles.statusBadge, backgroundColor: task.status === 'Submitted' ? '#e6f4ea' : '#fce8e6', color: task.status === 'Submitted' ? '#137333' : '#c5221f' }}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f4f6f9', padding: '30px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto 20px auto' },
  backBtn: { textDecoration: 'none', color: '#1a73e8', fontWeight: 'bold', fontSize: '15px' },
  mainGrid: { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  summaryRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flex: 1, minWidth: '280px' },
  cardValue: { fontSize: '28px', fontWeight: 'bold', margin: '10px 0 5px 0', color: '#202124' },
  subtext: { margin: 0, color: '#5f6368', fontSize: '14px' },
  progressContainer: { width: '100%', height: '12px', backgroundColor: '#dadce0', borderRadius: '6px', overflow: 'hidden', marginTop: '15px' },
  progressBar: { height: '100%', transition: 'width 0.4s ease' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  tableHeader: { backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dadce0' },
  th: { padding: '12px', fontSize: '14px', color: '#3c4043', fontWeight: 'bold' },
  tableRow: { borderBottom: '1px solid #e8eaed' },
  td: { padding: '12px', fontSize: '14px', color: '#202124' },
  list: { listStyle: 'none', padding: 0, margin: '15px 0 0 0', display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e8eaed' },
  statusBadge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#5f6368' },
  error: { padding: '20px', color: '#c5221f', textAlign: 'center' }
};

export default Academics;