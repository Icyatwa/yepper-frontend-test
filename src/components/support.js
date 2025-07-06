// support.js
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Info, BookOpen, ExternalLink, Sparkles, Star, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CONTENT_TYPES = {
  INTRODUCTION: 'introduction',
  TUTORIAL: 'tutorial',
};

function Support() {
  // Check localStorage for the user's preference about auto-showing
  const [isOpen, setIsOpen] = useState(localStorage.getItem('supportAutoShow') !== 'false');
  const [activeContentType, setActiveContentType] = useState(CONTENT_TYPES.TUTORIAL);
  const [autoShow, setAutoShow] = useState(localStorage.getItem('supportAutoShow') !== 'false');
  
  const menuRef = useRef(null);
  
  const toggleSupportMenu = () => setIsOpen(prev => !prev);
  
  // Function to disable auto-showing of the support modal
  const disableAutoShow = () => {
    setAutoShow(false);
    localStorage.setItem('supportAutoShow', 'false');
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getModalSize = () => {
    switch(activeContentType) {
      case CONTENT_TYPES.INTRODUCTION:
      case CONTENT_TYPES.TUTORIAL:
        return "w-full max-w-3xl";
      default:
        return "w-full max-w-3xl";
    }
  };
  
  const IntroductionContent = () => (
    <div className="text-white/90 space-y-6 p-2">
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">About Yepper</h2>
      
      <div className="mb-6">
        <p className="leading-relaxed mb-4 text-white/70">
          Yepper is a next-generation digital advertising platform designed to revolutionize 
          the way website owners and advertisers connect. It provides a seamless system where 
          website owners can monetize their sites by offering ad spaces, while advertisers can 
          efficiently manage and track their campaigns in real-time.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-3">How It Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 p-5 rounded-xl border border-white/10">
            <h4 className="font-medium text-blue-400 mb-2 flex items-center">
              <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-2 text-blue-400">1</span>
              Website Owners (Publishers)
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <span>Create and manage advertising spaces on their websites</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <span>Receive a unique API for each ad space, ensuring easy integration</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <span>Full control over which ads appear on their site</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <span>Earnings based on real visitor traffic</span>
              </li>
            </ul>
          </div>
          
          <div className="backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 p-5 rounded-xl border border-white/10">
            <h4 className="font-medium text-orange-400 mb-2 flex items-center">
              <span className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mr-2 text-orange-400">2</span>
              Advertisers
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Browse available ad spaces across multiple websites</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Access real-time data on engagement, clicks, and impressions</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Request custom ad designs within the platform</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Target specific audiences with precision</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">What Sets Yepper Apart</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Sparkles size={14} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Custom API for Every Ad Space</h4>
                <p className="text-sm text-white/70">Each ad space gets its own unique API, making integration smoother and performance tracking more accurate.</p>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Sparkles size={14} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Transparent Pricing Model</h4>
                <p className="text-sm text-white/70">Payments based on real visitor traffic, ensuring fair pricing for advertisers and higher earnings for publishers.</p>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Star size={14} className="text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Full Control for Website Owners</h4>
                <p className="text-sm text-white/70">Publishers have the final say on which ads appear, giving them complete control over content and user experience.</p>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Star size={14} className="text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Real-Time Performance Tracking</h4>
                <p className="text-sm text-white/70">Instant, detailed reports on ad performance, allowing for quick adjustments and better results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const TutorialContent = () => (
    <div className="text-white/90 p-2">
      <h2 className="text-2xl font-bold text-white mb-6">Getting Started with Yepper</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-2 text-orange-400">
            <BookOpen className="w-4 h-4" />
          </div>
          For Website Owners
        </h3>
        
        <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/10">
          {[
            {
              step: 1,
              title: "Add your website",
              description: "Register and verify ownership of your website in the dashboard"
            },
            {
              step: 2,
              title: "Select website spaces as categories",
              description: "Define the areas of your website where you want to display ads"
            },
            {
              step: 3, 
              title: "Choose the price for a space",
              description: "Set competitive pricing based on your traffic and niche"
            },
            {
              step: 4,
              title: "Set advertiser limits",
              description: "Add the number of users who are allowed to advertise on that space"
            },
            {
              step: 5,
              title: "Add instructions",
              description: "Provide guidelines for advertisers about content requirements"
            },
            {
              step: 6,
              title: "Generate and implement API",
              description: "Get your custom API and add it to your website code"
            }
          ].map((item, index) => (
              <div key={index} className="p-4 flex items-start hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-medium mr-4 flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 backdrop-blur-md bg-blue-900/20 border border-blue-400/20 rounded-xl flex items-start">
          <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-100">
            After adding your information, the system will generate an API script in different languages. 
            Add this script to your code exactly where you want the ads to appear based on the space you selected.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2 text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          For Advertisers
        </h3>
        
        <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/10">
            {[
              {
                step: 1,
                title: "Create your advertiser account",
                description: "Sign up and complete your profile with your brand information"
              },
              {
                step: 2,
                title: "Explore available websites",
                description: "Browse the websites that match your target audience"
              },
              {
                step: 3,
                title: "Explore available ad spaces",
                description: "Browse the marketplace for ad spaces that match your target audience"
              },
              {
                step: 4, 
                title: "Submit your ad creative",
                description: "Upload your ad designs or request custom designs within the platform"
              },
              {
                step: 5,
                title: "Set your advertising budget",
                description: "Define your spending limits and campaign duration"
              },
              {
                step: 6,
                title: "Launch your campaign",
                description: "Once approved by the website owner, your ads will go live"
              },
              {
                step: 7,
                title: "Monitor performance",
                description: "Track impressions, clicks, and conversions in real-time"
              }
            ].map((item, index) => (
              <div key={index} className="p-4 flex items-start hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium mr-4 flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          className="group relative h-12 px-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
          to='/videos'
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center">
            Watch Tutorial Videos <ExternalLink className="ml-2 w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
  
  return (
    <div>
      <button 
        className="group flex justify-center items-center w-14 h-14 p-1 fixed z-50 bottom-6 right-6 rounded-full overflow-hidden transition-all duration-500"
        onClick={toggleSupportMenu}
        aria-label="Open Support"
        style={{
          boxShadow: '0 0 20px rgba(234, 88, 12, 0.5)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-rose-600"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Search className="w-6 h-6 text-white" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-40 backdrop-blur-xl bg-black/80 border border-white/10 rounded-3xl shadow-2xl ${getModalSize()} h-auto max-h-[80vh] overflow-hidden`}
            ref={menuRef}
          >
            <div className="backdrop-blur-xl bg-black/20 border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="bg-gradient-to-r from-orange-600 to-rose-600 p-1.5 rounded-full mr-3">
                  <Info className="w-5 h-5 text-white" />
                </span>
                Yepper Support Center
              </h2>
              
              <div className="flex items-center space-x-2">
                {/* New "Don't show again" button */}
                <button
                  onClick={disableAutoShow}
                  className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center"
                  title="Don't show on page load"
                >
                  <Bell className="w-5 h-5" />
                  <span className="sr-only md:not-sr-only md:ml-1 text-sm">Don't show on startup</span>
                </button>
                
                {/* Original close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-black/20 border-b border-white/10 px-4 flex space-x-1">
              {[
                { id: CONTENT_TYPES.INTRODUCTION, label: 'About Yepper', icon: <Info className="w-4 h-4 mr-1" /> },
                { id: CONTENT_TYPES.TUTORIAL, label: 'Tutorials', icon: <BookOpen className="w-4 h-4 mr-1" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveContentType(tab.id)}
                  className={`py-3 px-4 flex items-center text-sm font-medium border-b-2 transition-colors ${
                    activeContentType === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 125px)' }}>
              {activeContentType === CONTENT_TYPES.INTRODUCTION && <IntroductionContent />}
              {activeContentType === CONTENT_TYPES.TUTORIAL && <TutorialContent />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Support;