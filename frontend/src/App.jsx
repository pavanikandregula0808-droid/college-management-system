import React from 'react';
import Faculty from './components/Faculty';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login_backup'; // TEMPORARY: Pointing to backup file to force Git to reset its tracking cache
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Academics from './components/Academics'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Added the Academics view route mapping */}
        <Route path="/academics" element={<Academics />} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;