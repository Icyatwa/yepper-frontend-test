import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black z-50">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-30"></div>
        {/* Spinner */}
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative" />
      </div>
    </div>
  );
};

export default LoadingSpinner;