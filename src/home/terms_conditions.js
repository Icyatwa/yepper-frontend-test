import React from 'react';
import { ArrowLeft, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

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
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">LEGAL</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-blue-500 mr-6"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Legal Document</span>
            <div className="h-px w-12 bg-blue-500 ml-6"></div>
          </div>
          
          <h1 className="text-center text-5xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Terms and Conditions
            </span>
          </h1>
          
          <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-6">
            Please read these terms carefully before using our platform and services.
          </p>
        </div>
        
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Section 1: Definitions */}
          <div className="backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <Shield className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="ml-4 text-2xl font-bold">1. Definitions</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Platform</span>
                    <span className="text-white/70">Refers to the Yepper website and associated services.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Web Owner</span>
                    <span className="text-white/70">An individual or entity that owns a website and creates spaces for advertisements on the platform.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Advertiser</span>
                    <span className="text-white/70">An individual or entity that uses the platform to publish ads.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Content</span>
                    <span className="text-white/70">Refers to all ad images, videos, or other materials uploaded by Advertisers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 2: Eligibility */}
          <div className="backdrop-blur-md bg-gradient-to-b from-purple-900/30 to-purple-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400">
                    <Shield className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="ml-4 text-2xl font-bold">2. Eligibility</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-white/70">Users must be 18 years or older and have the legal authority to enter into binding agreements.</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-white/70">By using Yepper, you confirm that all information provided is accurate and truthful.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 3: Web Owner Responsibilities */}
          <div className="backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <Shield className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="ml-4 text-2xl font-bold">3. Web Owner Responsibilities</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Website Creation</span>
                    <span className="text-white/70">Web Owners must provide accurate website details, including the website name, URL, and logo.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Category and Space Management</span>
                    <span className="text-white/70">Web Owners are responsible for setting appropriate prices, user counts, availability, and clear instructions for ad spaces.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">API Integration</span>
                    <span className="text-white/70">The script API generated by Yepper must be correctly integrated into their website to ensure ads display as intended.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium block mb-1">Approval of Ads</span>
                    <span className="text-white/70">Web Owners are responsible for reviewing and approving or rejecting ad requests in a timely manner.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sections 4-10: Continue the same pattern for remaining sections */}
          <div className="backdrop-blur-md bg-gradient-to-b from-purple-900/30 to-purple-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400">
                    <Shield className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="ml-4 text-2xl font-bold">4. Advertiser Responsibilities</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium block mb-1">Ad Content</span>
                    <span className="text-white/70">Advertisers must ensure that uploaded ad images or videos comply with applicable laws and do not contain prohibited content such as hate speech, offensive material, or misleading information.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium block mb-1">Business Information</span>
                    <span className="text-white/70">Accurate business details, including the name, website, location, and description, must be provided.</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                    <Star size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium block mb-1">Payment</span>
                    <span className="text-white/70">Advertisers must pay for approved ads promptly to ensure publication.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-gradient-to-b from-indigo-900/30 to-indigo-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400">
                    <Shield className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="ml-4 text-2xl font-bold">10. Contact Information</h2>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <p className="text-white/70 mb-4">For any questions or concerns regarding these Terms, please contact us at:</p>
                <a 
                  href="mailto:olympusexperts@gmail.com" 
                  className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                >
                  olympusexperts@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;