import React from 'react';
import Icon from './icon';
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="inline-flex items-center space-x-1.5 hover:opacity-90 transition-opacity"
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      <span className="font-extrabold text-blue-950 text-lg md:text-xl">
        Yepper
      </span>
    </Link>
  );
};

export default Logo;