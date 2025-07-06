import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Instagram, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full backdrop-blur-md bg-black/30 border-t border-white/10 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">YEPPER</span>
            </div>
          </div>
          
          {/* Links Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <div className="space-y-3">
              <Link to="/privacy" className="flex items-center text-white/60 hover:text-blue-400 transition-colors text-sm">
                <ExternalLink size={14} className="mr-2" />
                Privacy Policy
              </Link>
              <Link to="/terms" className="flex items-center text-white/60 hover:text-blue-400 transition-colors text-sm">
                <ExternalLink size={14} className="mr-2" />
                Terms & Conditions
              </Link>
            </div>
          </div>
          
          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:olympusexperts@gmail.com" className="flex items-center text-white/60 hover:text-blue-400 transition-colors text-sm">
                <Mail size={16} className="mr-2" />
                olympusexperts@gmail.com
              </a>
              <div className="flex space-x-4 mt-4">
                <a href="https://twitter.com/OlympusForge" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com/yepper.cc" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Yepper. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <span className="text-white/40 text-xs tracking-wide">BUILT WITH ♥ FOR THE FUTURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;