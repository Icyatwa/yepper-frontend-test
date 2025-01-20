import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "@clerk/clerk-react";
import Logo from "./logoName";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleGetStartedButton = () => {
    if (isLoaded && !userId) {
      // If user is not authenticated, redirect to sign-in
      navigate('/sign-in');
    } else if (isLoaded && userId) {
      // If user is authenticated, go to dashboard
      navigate('/dashboard');
    }
    setIsOpen(false);  // Close mobile menu after navigation
  };

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/yepper-ads" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/yepper-ads') 
                  ? 'text-blue-600 font-bold pointer-events-none' 
                  : 'text-blue-950 hover:text-blue-600'
                }`}
            >
              Yepper Ads
            </Link>
            <Link 
              to="/yepper-spaces" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/yepper-spaces') 
                  ? 'text-blue-600 font-bold pointer-events-none' 
                  : 'text-blue-950 hover:text-blue-600'
                }`}
            >
              Yepper Spaces
            </Link>

            <motion.button 
              className={`flex items-center text-white px-3 py-2 rounded-lg text-sm font-bold sm:text-base
                ${isActiveLink('/dashboard') 
                  ? 'bg-orange-500 font-bold pointer-events-none' 
                  : 'bg-[#FF4500] hover:bg-orange-500 transition-colors'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStartedButton}
            >
              {isLoaded && userId ? 'Dashboard' : 'Get Started'}
            </motion.button>
          </nav>
    
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-700 hover:text-orange-500 hover:bg-red-100 transition-colors duration-200 z-50"
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
    
      {/* Mobile Menu */}
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
          <Link
            to="/yepper-ads"
            className={`block text-center py-3 text-base font-medium transition-colors duration-200
              ${isActiveLink('/yepper-ads')
                ? 'text-blue-600 font-bold pointer-events-none' 
                : 'text-blue-950 hover:text-blue-600'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Yepper Ads
          </Link>
          <Link
            to="/yepper-spaces"
            className={`block text-center py-3 px-4 rounded-md transition-colors duration-200
              ${isActiveLink('/yepper-spaces')
                ? 'text-blue-600 font-bold pointer-events-none' 
                : 'text-blue-950 hover:text-blue-600'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Yepper Spaces
          </Link>

          <motion.button 
            className={`flex w-full justify-center items-center text-white px-2 py-2 rounded-lg text-sm font-bold sm:text-base
              ${isActiveLink('/dashboard') 
                ? 'bg-orange-500 font-bold pointer-events-none' 
                : 'bg-[#FF4500] hover:bg-orange-500 transition-colors'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStartedButton}
          >
            {isLoaded && userId ? 'Dashboard' : 'Get Started'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Header;