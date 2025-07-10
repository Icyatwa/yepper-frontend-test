// Header.js
import React, { useState, useEffect } from 'react';
import Logo from "./logoName";
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? isDarkMode 
          ? 'backdrop-blur-xl bg-black/20 border-b border-white/10' 
          : 'backdrop-blur-xl bg-white/20 border-b border-black/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;