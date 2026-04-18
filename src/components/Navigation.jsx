import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserPlus, Search } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/add" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <UserPlus className="nav-icon" size={24} />
        <span>Add New</span>
      </NavLink>
      
      <NavLink 
        to="/search" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Search className="nav-icon" size={24} />
        <span>Search</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
