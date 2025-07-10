// Home.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AdSide from '../components/AdSide';
import SpaceSide from '../components/SpaceSide';
import Header from '../components/description-header';
import { useTheme } from '../components/ThemeContext';

function Home() {
  const navigate = useNavigate();
  const [hoverAds, setHoverAds] = useState(false);
  const [hoverSpaces, setHoverSpaces] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Yepper Ads Card */}
          <div 
            className={`group relative backdrop-blur-md rounded-3xl overflow-hidden border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gradient-to-b from-blue-900/30 to-blue-900/10 border-white/10' 
                : 'bg-gradient-to-b from-blue-100/80 to-blue-50/60 border-blue-200/50'
            }`}
            style={{
              boxShadow: hoverAds ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverAds(true)}
            onMouseLeave={() => setHoverAds(false)}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10' 
                : 'bg-gradient-to-r from-blue-400/20 to-indigo-400/20'
            }`}></div>
            
            <div className="p-10 relative z-10">
              <AdSide />
              
              <button
                onClick={() => navigate('/select')}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <span className="uppercase tracking-wider">Publish Your Ad</span>
                </span>
              </button>
            </div>
          </div>

          {/* Yepper Spaces Card */}
          <div 
            className={`group relative backdrop-blur-md rounded-3xl overflow-hidden border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gradient-to-b from-orange-900/30 to-orange-900/10 border-white/10' 
                : 'bg-gradient-to-b from-orange-100/80 to-orange-50/60 border-orange-200/50'
            }`}
            style={{
              boxShadow: hoverSpaces ? '0 0 40px rgba(249, 115, 22, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverSpaces(true)}
            onMouseLeave={() => setHoverSpaces(false)}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-orange-600/10 to-rose-600/10' 
                : 'bg-gradient-to-r from-orange-400/20 to-rose-400/20'
            }`}></div>
            
            <div className="p-10 relative z-10">
              <SpaceSide />
              <button
                onClick={() => navigate('/create-website')}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <span className="uppercase tracking-wider">Add Your Website</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;