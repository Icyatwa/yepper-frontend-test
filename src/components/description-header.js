// Header.js
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
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
      navigate('/sign-in');
    } else if (isLoaded && userId) {
      navigate('/dashboard');
    }
    setIsOpen(false);
  };

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl bg-black/20 border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/yepper-ads" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/yepper-ads') 
                  ? 'text-blue-400 font-medium pointer-events-none' 
                  : 'text-white/70 hover:text-white'
                }`}
            >
              Yepper Ads
            </Link>
            <Link 
              to="/yepper-spaces" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/yepper-spaces') 
                  ? 'text-blue-400 font-medium pointer-events-none' 
                  : 'text-white/70 hover:text-white'
                }`}
            >
              Yepper Spaces
            </Link>

            <Link 
              to="/videos" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/videos') 
                  ? 'text-blue-400 font-medium pointer-events-none' 
                  : 'text-white/70 hover:text-white'
                }`}
            >
              Videos
            </Link>

            <Link 
              to="/pricing" 
              className={`px-4 py-2 rounded-md transition-colors duration-200
                ${isActiveLink('/pricing') 
                  ? 'text-blue-400 font-medium pointer-events-none' 
                  : 'text-white/70 hover:text-white'
                }`}
            >
              Pricing
            </Link>

            <motion.button 
              className="group relative h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStartedButton}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isLoaded && userId ? 'Dashboard' : 'Get Started'}
              </span>
            </motion.button>
          </nav>
    
          <div className="md:hidden flex items-center space-x-4">
            <div className={isActiveLink('/dashboard') ? "bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest" : "hidden"}>
              DASHBOARD
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-2 inline-flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
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
      </div>
    
      {/* Mobile Menu */}
      <div className={`
        md:hidden 
        fixed 
        inset-0 
        z-40 
        bg-black/90 backdrop-blur-xl
        transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="relative pt-28 pb-6 px-6 space-y-8">
          <Link
            to="/yepper-ads"
            className={`block text-center py-3 text-lg font-medium transition-colors duration-200
              ${isActiveLink('/yepper-ads')
                ? 'text-blue-400 font-medium pointer-events-none' 
                : 'text-white/70 hover:text-white'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Yepper Ads
          </Link>

          <Link
            to="/yepper-spaces"
            className={`block text-center py-3 text-lg font-medium transition-colors duration-200
              ${isActiveLink('/yepper-spaces')
                ? 'text-blue-400 font-medium pointer-events-none' 
                : 'text-white/70 hover:text-white'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Yepper Spaces
          </Link>

          <Link
            to="/videos"
            className={`block text-center py-3 text-lg font-medium transition-colors duration-200
              ${isActiveLink('/videos')
                ? 'text-blue-400 font-medium pointer-events-none' 
                : 'text-white/70 hover:text-white'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Videos
          </Link>

          <Link
            to="/pricing"
            className={`block text-center py-3 text-lg font-medium transition-colors duration-200
              ${isActiveLink('/pricing')
                ? 'text-blue-400 font-medium pointer-events-none' 
                : 'text-white/70 hover:text-white'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>

          <div className="pt-6">
            <motion.button 
              className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetStartedButton}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center uppercase tracking-wider">
                {isLoaded && userId ? 'Go to Dashboard' : 'Get Started'}
              </span>
            </motion.button>
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="rounded-full px-6 py-3 bg-white/5 backdrop-blur-md flex items-center space-x-2">
              <span className="text-white/60 text-sm">Need guidance?</span>
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">Request a consultation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;