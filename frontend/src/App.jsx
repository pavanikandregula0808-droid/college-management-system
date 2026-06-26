import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; // 🚀 Imported your brand new dual-option gateway landing page
import Faculty from './components/Faculty';
import Login from './components/login'; 
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Academics from './components/Academics'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Root Gateway page showing both Sign In and Sign Up entrypoints */}
        <Route path="/" element={<Home />} />

        {/* 2. Individual Authentication & Feature Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/academics" element={<Academics />} />
      </Routes>
    </Router>
  );
}

export default App;