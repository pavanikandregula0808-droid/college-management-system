import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to College Management System</h1>
        <p style={styles.subtitle}>Please select an option below to access your portal</p>
        
        <div style={styles.buttonContainer}>
          <button style={styles.loginButton} onClick={() => navigate('/login')}>
            Sign In (Login)
          </button>
          
          <button style={styles.registerButton} onClick={() => navigate('/register')}>
            Create Account (Register)
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: '#fff', padding: '50px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '500px', textAlign: 'center' },
  title: { margin: '0 0 10px 0', color: '#1a73e8', fontSize: '28px', fontWeight: 'bold' },
  subtitle: { margin: '0 0 35px 0', color: '#5f6368', fontSize: '15px' },
  buttonContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  loginButton: { padding: '14px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' },
  registerButton: { padding: '14px', backgroundColor: '#34a853', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }
};

export default Home;