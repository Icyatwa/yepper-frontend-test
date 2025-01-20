import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import './TermsPrivacyHeader.css';
import add from '../assets/img/plus (1).png';
import dashboard from '../assets/img/dashboard.png';
import menuIcon from '../assets/img/menu.png';
import closeIcon from '../assets/img/close.png';
import Logo from "../components/logo";
import BackButton from '../components/backToPreviusButton';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='header-ctn'>
        <header>
            <nav>
                <div className="container">
                    <div className='logo'>
                        <BackButton />
                    </div>
                    <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                        <Link style={{cursor:'pointer'}} to='/'>
                            <Logo />
                        </Link>
                    </div>
                    <div className="user">
                        <SignedIn>
                            <UserButton afterSignOutUrl='/sign-in' />
                        </SignedIn>
                        <SignedOut>
                            <Link to="/sign-in" onClick={toggleMenu}>Login</Link>
                        </SignedOut>
                        <Link to='/terms' className='direct' onClick={toggleMenu}>
                            Terms
                        </Link>
                        <Link to='/privacy' className='direct privacy' onClick={toggleMenu}>
                            Privacy
                        </Link>
                    </div>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <img src={isOpen ? closeIcon : menuIcon} alt="Menu Toggle" />
                    </button>
                </div>
            </nav>
        </header>
    </div>
  )
}

export default Header;
