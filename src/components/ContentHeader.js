import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import './styles/ContentHeader.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="logo-menu-container">
          <Link to="/dashboard" className="logo">AdManager</Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className={`main-navigation ${isMenuOpen ? 'menu-open' : ''}`}>
          <div className="nav-links">
            <NavLink 
              to="/ads-dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Ads
            </NavLink>
            <NavLink 
              to="/pending-dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Pending Ads
            </NavLink>
            <NavLink 
              to="/approved-dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Approved Ads
            </NavLink>
            <NavLink 
              to="/websites-dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Websites
            </NavLink>
          </div>

          <div className="user-actions">
            <SignedIn>
              <UserButton afterSignOutUrl='/sign-in' />
            </SignedIn>
            <SignedOut>
              <Link to="/sign-in" className="sign-in-button">Login</Link>
            </SignedOut>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;