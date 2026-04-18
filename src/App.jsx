import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Header from './components/Header';
import AddCustomer from './components/AddCustomer';
import SearchCustomer from './components/SearchCustomer';
import TodaysOrders from './components/TodaysOrders';
import Tracker from './components/Tracker';
import About from './components/About';
import './index.css';

export const RefreshContext = createContext({ refreshKey: 0 });

function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Confirm before closing/leaving on mobile back button
  useEffect(() => {
    // Push an extra state so back button hits this instead of closing
    window.history.pushState({ preventClose: true }, '');

    const handlePopState = () => {
      const confirmed = window.confirm('Are you sure you want to exit JD Tailors?');
      if (confirmed) {
        // Let the browser go back naturally
        window.history.back();
      } else {
        // Re-push so back button works again next time
        window.history.pushState({ preventClose: true }, '');
      }
    };

    const handleBeforeUnload = (e) => {
      if (window.__intentionalReload) return; // skip popup for app-triggered reloads
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Brief spinner then silent reload — no popup
    setTimeout(() => {
      window.__intentionalReload = true;
      window.location.reload();
    }, 400);
  };

  return (
    <RefreshContext.Provider value={{ refreshKey }}>
      <Router>
        <Header />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<TodaysOrders />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/add" element={<AddCustomer />} />
            <Route path="/search" element={<SearchCustomer />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Navigation onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      </Router>
    </RefreshContext.Provider>
  );
}

export default App;

