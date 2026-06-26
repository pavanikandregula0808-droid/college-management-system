import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Grab the saved user data session string from browser memory
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // 2. Security Guard: If no token or user profile exists, kick them back to login!
    if (!savedUser || !token) {
      navigate('/login');
    } else {
      // Parse the JSON string back into a readable JavaScript object
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  // Clears the digital passport badge and kicks them out to sign-in screen
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) {
    return <div style={styles.loading}>Loading secure dashboard...</div>;
  }

  // Normalize case-checking by making it case-insensitive or matching our database Capitalized style
  const userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>College Portal</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </nav>

      {/* Main Content Card Layout */}
      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.greeting}>Welcome Back, {user.name}! 👋</h1>
          <p style={styles.subtext}>Here is your campus profile status tracking panel.</p>
          
          <hr style={styles.divider} />

          {/* User Details Table Grid */}
          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <strong>Registered Email:</strong>
              <p>{user.email}</p>
            </div>
            <div style={styles.infoBox}>
              <strong>Portal Access Role:</strong>
              <span style={{ ...styles.badge, ...styles[userRole.toLowerCase()] }}>
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Section showing specific tools based on account type */}
        <div style={styles.rolePanel}>
          <h3>System Quick Links</h3>
          
          {/* Student Layout view */}
          {userRole === 'Student' && (
            <div>
              <p>📚 View Class Schedules, Internal Marks, and Semester Attendance Tracking panels.</p>
              <Link to="/academics" style={styles.academicsLink}>
                ➔ Enter Student Academics Hub
              </Link>
            </div>
          )}

          {/* NEW & FIXED: Faculty Layout View */}
          {userRole === 'Faculty' && (
            <div>
              <p>📝 Upload Student Grades, Attendance registers, and manage Lecture notes.</p>
              <Link to="/faculty" style={styles.facultyLink}>
                ➔ Enter Faculty Assessment Portal
              </Link>
            </div>
          )}

          {/* Admin Layout View */}
          {userRole === 'Admin' && (
            <p>⚙️ Full Infrastructure Control: Add departments, view system audits, and manage registration records.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a73e8', padding: '15px 30px', color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { margin: 0, fontSize: '20px' },
  logoutBtn: { backgroundColor: '#ea4335', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  content: { padding: '40px max(4%, 20px)', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  welcomeCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  greeting: { margin: '0 0 5px 0', color: '#202124' },
  subtext: { margin: '0 0 20px 0', color: '#5f6368', fontSize: '15px' },
  divider: { border: '0', height: '1px', backgroundColor: '#dadce0', marginBottom: '20px' },
  infoGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  infoBox: { flex: '1', minWidth: '200px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #e8eaed' },
  badge: { display: 'inline-block', marginTop: '5px', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#fff' },
  student: { backgroundColor: '#1a73e8' },
  faculty: { backgroundColor: '#f4b400' },
  admin: { backgroundColor: '#0f9d58' },
  rolePanel: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #1a73e8' },
  academicsLink: { display: 'inline-block', marginTop: '12px', color: '#1a73e8', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' },
  facultyLink: { display: 'inline-block', marginTop: '12px', backgroundColor: '#1a73e8', color: 'white', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#5f6368' }
};

export default Dashboard;