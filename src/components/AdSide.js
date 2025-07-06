// AdSide.js
import React from 'react';
import { Sparkles } from 'lucide-react';

function AdSide() {
    return (
        <div className="space-y-4 mb-12">
            <p className="text-white/70 mb-8">
                Yepper Ads empowers businesses with smart targeting, custom designs, and real-time analytics for impactful, personalized campaigns.
            </p>
            
            <div className="flex items-center text-white/80">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-blue-400" />
                </div>
                <span>Smart audience targeting</span>
            </div>
            <div className="flex items-center text-white/80">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-blue-400" />
                </div>
                <span>Custom design capabilities</span>
            </div>
            <div className="flex items-center text-white/80">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-blue-400" />
                </div>
                <span>Real-time performance analytics</span>
            </div>
        </div>
    );
}

export default AdSide;