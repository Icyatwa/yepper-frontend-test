import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BackButton from './backToPreviusButton'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <BackButton />
          </div>
    
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/terms" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/terms') 
                  ? 'text-blue-600 font-bold pointer-events-none' 
                  : 'text-blue-950 hover:text-blue-600'
                }`}
            >
              Terms
            </Link>
            <Link 
              to="/privacy" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/privacy') 
                  ? 'text-blue-600 font-bold pointer-events-none' 
                  : 'text-blue-950 hover:text-blue-600'
                }`}
            >
              Privacy
            </Link>
          </nav>
    
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-700 hover:text-green-500 hover:bg-green-100 transition-colors duration-200 z-50"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className={`
        md:hidden 
        fixed 
        inset-0 
        z-40 
        bg-white 
        transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="relative pt-20 pb-6 px-4 space-y-6">
          <a
            href="/terms"
            className={`block text-center py-3 text-base font-medium transition-colors duration-200
              ${isActiveLink('/terms')
                ? 'text-blue-600 font-bold pointer-events-none' 
                : 'text-blue-950 hover:text-blue-600'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Terms
          </a>
          <a
            href="/privacy"
            className={`block text-center py-3 px-4 rounded-md transition-colors duration-200
              ${isActiveLink('/privacy')
                ? 'text-blue-600 font-bold pointer-events-none' 
                : 'text-blue-950 hover:text-blue-600'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;