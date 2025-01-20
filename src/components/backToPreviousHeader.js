import React from 'react';
import BackButton from './backToPreviusButton'

const Header = () => {
  return (
    <div className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;