import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import './styles/index.css';
import './styles/font-optimization.css';
import { BUILD_VERSION } from './utils/build-timestamp';

// Force bundle update - version 1.0.3 - BUILD_VERSION: 1.0.3
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
