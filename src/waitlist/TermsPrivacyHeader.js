import React, { useState } from "react";
import { Link } from "react-router-dom";
import './styles/TermsPrivacyHeader.css';
import menuIcon from './img/menu.png';
import closeIcon from './img/close.png';
import Logo from "./logo";
import BackButton from './backToPreviusButton';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='header-ctn'>
        <header>
            <div className='back-button'>
                <BackButton />
            </div>
            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <Link style={{cursor:'pointer'}} to='/'>
                    <Logo />
                </Link>
            </div>
            <div className="user">
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
        </header>
    </div>
  )
}

export default Header;
