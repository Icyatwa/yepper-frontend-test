import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, UserCheck, Send } from 'lucide-react';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const [hoverInfo, setHoverInfo] = useState(false);
  const [hoverSecurity, setHoverSecurity] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ultra-modern header with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium tracking-wide">BACK</span>
          </button>
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">PRIVACY</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 text-center background-clip-text">Privacy Policy for Yepper</h1>
          <p className="text-xl text-center text-white/80 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Information We Collect Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverInfo ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverInfo(true)}
            onMouseLeave={() => setHoverInfo(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <UserCheck className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-3xl font-bold">Information & Usage</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">1. Information We Collect</h3>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>From Web Owners</strong>: Website details, pricing, space availability, and API integration data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>From Advertisers</strong>: Ad content, business information, payment details, and selected advertising preferences.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>Automatically</strong>: Device information, IP address, and browsing behavior when accessing Yepper.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">2. How We Use Your Information</h3>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>To facilitate and manage the advertising process.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>To generate and maintain scripts for API integration.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>To process payments and transactions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>To communicate with users about approvals, payments, and platform updates.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">3. Sharing of Information</h3>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>With Web Owners</strong>: Advertisers' business details and ad content for review and approval.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>With Advertisers</strong>: Approved Web Owner's website details and space availability.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>With Third Parties</strong>: Payment processors and service providers aiding in the platform's operation.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security & User Rights Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverSecurity ? '0 0 40px rgba(249, 115, 22, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverSecurity(true)}
            onMouseLeave={() => setHoverSecurity(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                    <Shield className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-3xl font-bold">Security & Rights</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-orange-300">4. Data Security</h3>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>Yepper uses industry-standard encryption and security measures to protect your data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>Users are responsible for maintaining the confidentiality of their account credentials.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-orange-300">5. User Rights</h3>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span><strong>Access</strong>: Request access to your personal data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span><strong>Correction</strong>: Update or correct your data.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-orange-300">6. Changes to This Policy</h3>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>Yepper may update this policy periodically. Users will be notified of significant changes.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 mt-6 border-t border-white/10">
                  <h3 className="text-xl font-semibold mb-3 text-orange-300">Contact Us</h3>
                  <p className="text-white/80">
                    For questions or concerns about these terms or our privacy policy, please contact us at:
                  </p>
                  <a href="mailto:icyatwandoba@gmail.com" className="flex items-center mt-3 text-orange-400 hover:text-orange-300 transition-colors">
                    <Send size={16} className="mr-2" />
                    <span>olympusexperts@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;