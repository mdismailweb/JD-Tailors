import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddCustomer from './components/AddCustomer';
import SearchCustomer from './components/SearchCustomer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/add" replace />} />
          <Route path="/add" element={<AddCustomer />} />
          <Route path="/search" element={<SearchCustomer />} />
        </Routes>
      </div>
      <Navigation />
    </Router>
  );
}

export default App;
