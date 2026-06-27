import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBadge}>CMS</div>
        </div>
        <h1 style={styles.title}>College Management System</h1>
        <p style={styles.subtitle}>Welcome to your institutional portal. Please authenticate or create an profile to access your academic workspace.</p>
        
        <div style={styles.buttonContainer}>
          <button 
            style={styles.primaryButton} 
            onClick={() => navigate('/login')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          >
            Sign In to Portal
          </button>
          
          <button 
            style={styles.secondaryButton} 
            onClick={() => navigate('/register')}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: '"Inter", "Segoe UI", sans-serif', padding: '20px' },
  card: { backgroundColor: '#1e293b', padding: '50px 40px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '100%', maxWidth: '480px', textAlign: 'center', border: '1px solid #334155' },
  logoContainer: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
  logoBadge: { backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', fontSize: '18px', padding: '8px 16px', borderRadius: '8px', letterSpacing: '1px', boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)' },
  title: { margin: '0 0 12px 0', color: '#f8fafc', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' },
  subtitle: { margin: '0 0 36px 0', color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' },
  buttonContainer: { display: 'flex', flexDirection: 'column', gap: '14px' },
  primaryButton: { padding: '14px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '6px', transition: 'all 0.2s ease', fontWeight: '600' },
  secondaryButton: { padding: '14px', backgroundColor: 'transparent', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease' }
};

export default Home;