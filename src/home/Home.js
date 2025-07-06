// Home.js
import React, { useState } from 'react';
import { Target, Globe } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Header from '../components/description-header';
import AdSide from '../components/AdSide';
import SpaceSide from '../components/SpaceSide';
import Support from '../components/support';

function Home() {
  const navigate = useNavigate();
  const [hoverAds, setHoverAds] = useState(false);
  const [hoverSpaces, setHoverSpaces] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Support />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-24">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-blue-500 mr-6"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Yepper Platform</span>
            <div className="h-px w-12 bg-blue-500 ml-6"></div>
          </div>
          
          <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Forging Powerful Connections
            </span>
          </h1>
          
          <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-6">
            Seamlessly bridge advertisers and publishers with our cutting-edge platform that transforms digital advertising into meaningful connections.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Yepper Ads Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverAds ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverAds(true)}
            onMouseLeave={() => setHoverAds(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <Target className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="uppercase text-xs font-semibold text-blue-400 tracking-widest mb-1">For Advertisers</div>
                  <h2 className="text-3xl font-bold">Yepper Ads</h2>
                </div>
              </div>
              
              <AdSide />
              
              <button
                onClick={() => navigate('/select')}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
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
            className="group relative backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverSpaces ? '0 0 40px rgba(249, 115, 22, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverSpaces(true)}
            onMouseLeave={() => setHoverSpaces(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                    <Globe className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="uppercase text-xs font-semibold text-orange-400 tracking-widest mb-1">For Publishers</div>
                  <h2 className="text-3xl font-bold">Yepper Spaces</h2>
                </div>
              </div>
              
              <SpaceSide />
              
              <button
                onClick={() => navigate('/create-website')}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
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