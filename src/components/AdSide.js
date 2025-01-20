import React from 'react';

function AdSide() {
    return (
        <div 
            className="bg-white min-h-[120px] sm:min-h-[150px] rounded-2xl shadow-xl border border-blue-50 
                transition-all duration-300 ease-in-out transform hover:-translate-y-2 w-full"
        >
            <div className="p-3 sm:p-6 h-full">
                <div 
                    className="prose prose-sm sm:prose-base text-gray-600 transition-all duration-300"
                >
                    <p className="text-sm sm:text-base leading-relaxed">
                        Yepper Ads empowers businesses with smart targeting, custom designs, and real-time analytics for impactful, personalized campaigns.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdSide;