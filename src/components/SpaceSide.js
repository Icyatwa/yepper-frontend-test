// SpaceSide.js
import React from 'react';
import { Sparkles } from 'lucide-react';

function SpaceSide() {
    return (
        <div className="space-y-4 mb-12">
            <p className="text-white/70 mb-8">
                Yepper Spaces helps web owners monetize seamlessly with smart, user-friendly ads and transparent revenue tracking.
            </p>
            
            <div className="flex items-center text-white/80">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-orange-400" />
                </div>
                <span>Seamless website integration</span>
            </div>
            <div className="flex items-center text-white/80">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-orange-400" />
                </div>
                <span>User-friendly control panel</span>
            </div>
            <div className="flex items-center text-white/80">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-orange-400" />
                </div>
                <span>Transparent revenue tracking</span>
            </div>
        </div>
    );
}

export default SpaceSide;