import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserPlus, Search, CalendarCheck, RefreshCw, Info, PackageSearch } from 'lucide-react';

const Navigation = ({ onRefresh, isRefreshing }) => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/today" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <CalendarCheck className="nav-icon" size={22} />
        <span>Today</span>
      </NavLink>

      <NavLink to="/tracker" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PackageSearch className="nav-icon" size={22} />
        <span>Tracker</span>
      </NavLink>

      <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <UserPlus className="nav-icon" size={22} />
        <span>Add New</span>
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search className="nav-icon" size={22} />
        <span>Search</span>
      </NavLink>

      <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Info className="nav-icon" size={22} />
        <span>About</span>
      </NavLink>

      <button onClick={onRefresh} disabled={isRefreshing} className="nav-item"
        style={{ background:'none', border:'none', cursor: isRefreshing ? 'not-allowed' : 'pointer', color: isRefreshing ? '#818CF8' : 'var(--text-muted)', padding:0 }}>
        <RefreshCw className="nav-icon" size={22} style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none', color: isRefreshing ? '#818CF8' : 'inherit' }} />
        <span style={{ fontSize:'12px', fontWeight:500 }}>{isRefreshing ? 'Syncing…' : 'Refresh'}</span>
      </button>
    </nav>
  );
};

export default Navigation;

