import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full px-5 py-10 text-gray-800 grid gap-5">
      {/* Middle section */}
      <div className="flex justify-between py-5 border-b border-gray-200 md:flex-row flex-col">
        <div className="flex md:gap-12 gap-6 md:flex-row flex-col">
          <div className="flex-1 md:text-left text-center">
            <div className="mb-2.5">
              <label className="text-lg font-bold text-blue-950">
                Contact us
              </label>
            </div>
            <div className="flex flex-row gap-2 md:justify-start justify-center">
              <a 
                href="mailto:olympusexperts@gmail.com?subject=Customer%20Inquiry&body=Hello%20Yepper%20Team,"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-base no-underline"
              >
                olympusexperts@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex md:gap-6 gap-4 items-center md:mt-0 mt-4 md:justify-start justify-center">
          <Link 
            to="/privacy"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm no-underline"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link 
            to="/terms"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm no-underline"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
