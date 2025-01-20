import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-screen bg-white z-50">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;