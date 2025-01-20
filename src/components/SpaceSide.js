import React from 'react';

function SpaceSide() {

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
                        Yepper Spaces helps web owners monetize seamlessly with smart, user-friendly ads and transparent revenue tracking.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SpaceSide;

