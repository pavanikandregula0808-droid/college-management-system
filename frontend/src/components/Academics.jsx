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

    // ✅ FIXED LIVE PIPELINE ROUTE: Now pointing straight to your production backend on Render!
    axios.get(`https://college-management-system-uk0d.onrender.com/api/student/academics?userId=${currentUser.id}`)
      .then(res => setAcademicData(res.data))
      .catch(err => setError('Failed to pull verified academic matrices from database pipeline.'));
  }, [navigate]);

  if (error) return <div style={styles.error}>⚠️ {error}</div>;
  if (!academicData) return <div style={styles.loading}>Initializing workspace secure node connection...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.mainTitle}>Academic Performance Node</h2>
        <Link to="/dashboard" style={styles.backBtn}>Back to Dashboard</Link>
      </header>

      <div style={styles.mainGrid}>
        {/* Attendance & GPA Summary Cards */}
        <div style={styles.summaryRow}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Semester Attendance</h3>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${academicData.attendance}%`, backgroundColor: academicData.attendance >= 75 ? '#10b981' : '#ef4444' }}></div>
            </div>
            <p style={styles.cardValue}>{academicData.attendance}% Metrics</p>
            <small style={{ color: academicData.attendance >= 75 ? '#34d399' : '#f87171', fontWeight: '600' }}>
              {academicData.attendance >= 75 ? '✅ Institutional attendance requirements satisfied.' : '❌ Structural Danger: Below 75% baseline.'}
            </small>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Cumulative Grade Point Average</h3>
            <p style={{ ...styles.cardValue, fontSize: '42px', color: '#6366f1' }}>{academicData.gpa} <span style={{fontSize: '18px', color: '#64748b'}}> / 10</span></p>
            <p style={styles.subtext}>Verified active cumulative evaluation index.</p>
          </div>
        </div>

        {/* Internal Examination Marks Table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Internal Assessment Metrics</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Subject / Course Vector</th>
                  <th style={styles.th}>Obtained Score</th>
                  <th style={styles.th}>Max Allocation</th>
                  <th style={styles.th}>Relative Yield</th>
                </tr>
              </thead>
              <tbody>
                {academicData.internals.map((item, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td style={styles.td}><strong style={{color: '#f8fafc'}}>{item.subject}</strong></td>
                    <td style={styles.td}>{item.obtainedMarks}</td>
                    <td style={styles.td}>{item.maxMarks}</td>
                    <td style={{ ...styles.td, color: '#38bdf8', fontWeight: '600' }}>{((item.obtainedMarks / item.maxMarks) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Coursework / Assignments */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Active Curricular Task Queues</h3>
          <ul style={styles.list}>
            {academicData.assignments.map((task) => (
              <li key={task.id} style={styles.listItem}>
                <div>
                  <strong style={{color: '#e2e8f0'}}>{task.title}</strong>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Pipeline Deadline: {task.dueDate}</p>
                </div>
                <span style={{ 
                  ...styles.statusBadge, 
                  backgroundColor: task.status === 'Submitted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                  color: task.status === 'Submitted' ? '#34d399' : '#f87171',
                  border: task.status === 'Submitted' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                }}>
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
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 20px', fontFamily: '"Inter", sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '960px', margin: '0 auto 30px auto', borderBottom: '1px solid #1e293b', paddingBottom: '16px' },
  mainTitle: { color: '#f8fafc', margin: 0, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' },
  backBtn: { textDecoration: 'none', color: '#818cf8', fontWeight: '600', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', transition: 'all 0.2s ease' },
  mainGrid: { maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
  summaryRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  card: { backgroundColor: '#1e293b', padding: '28px', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', flex: 1, minWidth: '290px', border: '1px solid #334155' },
  cardTitle: { color: '#cbd5e1', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', letterSpacing: '0.3px' },
  cardValue: { fontSize: '32px', fontWeight: '700', margin: '12px 0 6px 0', color: '#f8fafc' },
  subtext: { margin: 0, color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' },
  progressContainer: { width: '100%', height: '10px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden', marginTop: '16px', marginBottom: '12px', border: '1px solid #334155' },
  progressBar: { height: '100%', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '8px' },
  tableHeader: { backgroundColor: '#0f172a', textAlign: 'left', borderBottom: '2px solid #334155' },
  th: { padding: '14px', fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' },
  tableRow: { borderBottom: '1px solid #334155', backgroundColor: 'transparent', transition: 'background 0.2s' },
  td: { padding: '14px', fontSize: '14px', color: '#cbd5e1' },
  list: { listStyle: 'none', padding: 0, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: '12px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155' },
  statusBadge: { padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.3px' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '16px', color: '#94a3b8', backgroundColor: '#0f172a' },
  error: { padding: '30px', color: '#f87171', backgroundColor: '#0f172a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', fontWeight: '600' }
};

export default Academics;