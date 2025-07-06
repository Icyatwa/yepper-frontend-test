import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PlusCircle, Globe, FileText, ArrowLeft } from 'lucide-react';

function Request() {
  const navigate = useNavigate();
  const [hoverWeb, setHoverWeb] = useState(false);
  const [hoverAd, setHoverAd] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ultra-modern header with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium tracking-wide">BACK</span>
          </button>
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">CREATE</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Website Integration Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverWeb ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverWeb(true)}
            onMouseLeave={() => setHoverWeb(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <Globe className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-3xl font-bold">Website Integration</h2>
                </div>
              </div>
              
              {/* Large image that fills the container */}
              <div className="w-full h-64 overflow-hidden rounded-xl mb-8">
                <img 
                  src="https://img.freepik.com/premium-vector/world-wide-web-internet-globe-hyperlink-browser-icon-with-www-sign-3d-vector-cartoon-minimal-style_365941-1114.jpg?uid=R102997587&ga=GA1.1.1987372731.1735646770&semt=ais_hybrid" 
                  alt="Website integration visualization" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => navigate('/create-website')}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <PlusCircle size={16} className="mr-2" />
                  <span className="uppercase tracking-wider">Connect Website</span>
                </span>
              </button>
            </div>
          </div>

          {/* Custom Advertisement Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverAd ? '0 0 40px rgba(249, 115, 22, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverAd(true)}
            onMouseLeave={() => setHoverAd(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                    <FileText className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-3xl font-bold">Custom Advertisement</h2>
                </div>
              </div>
              
              {/* Large image that fills the container */}
              <div className="w-full h-64 overflow-hidden rounded-xl mb-8">
                <img 
                  src="https://img.freepik.com/premium-photo/red-megaphone-with-red-plastic-cover-that-saysmegaphoneon-it_120585-338.jpg?uid=R102997587&ga=GA1.1.1987372731.1735646770&semt=ais_hybrid" 
                  alt="Custom advertisement showcase" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => navigate('/select')}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <PlusCircle size={16} className="mr-2" />
                  <span className="uppercase tracking-wider">Create Ad</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Request;