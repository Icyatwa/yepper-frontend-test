// Section1.js
import React from 'react';
import { Edit2, Users } from 'lucide-react';

function Section1() {
  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <div className="h-px w-12 bg-blue-500 mr-6"></div>
        <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Ad Platform</span>
        <div className="h-px w-12 bg-blue-500 ml-6"></div>
      </div>
      
      <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Advertising Reimagined
        </span>
      </h1>
      
      <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-16">
        Streamline ad creation, approvals, and placement with precision and ease.
        Elevate your brand's digital presence through strategic partnerships.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Block 1 */}
        <div 
          className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          
          <div className="p-8 relative z-10">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                  <Edit2 className="text-white" size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold">Personalized Design</h3>
              </div>
            </div>
            
            <p className="text-white/70 mb-6">
              Craft ads that truly speak to your audience. Request tailored designs that
              capture your brand's unique voice and aesthetic.
            </p>
          </div>
        </div>

        {/* Block 2 */}
        <div 
          className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          
          <div className="p-8 relative z-10">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                  <Users className="text-white" size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold">Strategic Partnerships</h3>
              </div>
            </div>
            
            <p className="text-white/70 mb-6">
              Connect with website owners in meaningful ways. Place ads that enhance
              visibility without compromising user experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section1;