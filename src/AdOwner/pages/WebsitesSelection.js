// WebsiteSelection.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Check, Search, Filter, ArrowLeft, PlusCircle, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

function Websites() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId, businessName, businessLink, businessLocation, adDescription, businessCategory } = location.state || {};
  const [websites, setWebsites] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/createWebsite');
        const data = await response.json();
        
        // Always show websites that accept 'any' category
        // Additionally show websites that match the specific business category
        const relevantWebsites = data.filter(website => {
          // Safety check: ensure businessCategories exists and is an array
          const categories = website.businessCategories;
          if (!categories || !Array.isArray(categories)) {
            return false; // Skip websites without proper categories
          }

          // Always include websites that accept 'any' category
          if (categories.includes('any')) {
            return true;
          }
          
          // Also include websites that accept the specific business category
          if (businessCategory && categories.includes(businessCategory)) {
            return true;
          }
          
          return false;
        });
        
        setWebsites(relevantWebsites);
        setFilteredWebsites(relevantWebsites);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch websites:', error);
        setError('Failed to fetch websites. Please try again.');
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [businessCategory]);

  useEffect(() => {
    let result = websites;
    
    if (searchTerm) {
      result = result.filter(site => 
        site.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.websiteLink.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredWebsites(result);
  }, [searchTerm, websites]);

  const handleSelect = (websiteId) => {
    setSelectedWebsites(prev => 
      prev.includes(websiteId) 
        ? prev.filter(id => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const handleNext = () => {
    if (selectedWebsites.length === 0) return;

    navigate('/select-categories', {
      state: {
        file,
        userId,
        businessName,
        businessLink,
        businessLocation,
        adDescription,
        businessCategory,
        selectedWebsites,
      },
    });
  };

  // Helper function to format business category for display
  const formatCategoryForDisplay = (categories) => {
    // Safety check for categories
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return 'No Categories';
    }

    if (categories.includes('any')) {
      return 'All Categories';
    }
    
    const categoryLabels = {
      'technology': 'Technology',
      'food-beverage': 'Food & Beverage',
      'real-estate': 'Real Estate',
      'automotive': 'Automotive',
      'health-wellness': 'Health & Wellness',
      'entertainment': 'Entertainment',
      'fashion': 'Fashion',
      'education': 'Education',
      'business-services': 'Business Services',
      'travel-tourism': 'Travel & Tourism',
      'arts-culture': 'Arts & Culture',
      'photography': 'Photography',
      'gifts-events': 'Gifts & Events',
      'government-public': 'Government & Public',
      'general-retail': 'General Retail'
    };
    
    return categories.map(cat => categoryLabels[cat] || cat).join(', ');
  };

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
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">SELECT WEBSITES</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">          
          <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Choose websites
            </span>
          </h1>
          
          <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-6">
            Select from available websites to reach your target audience effectively.
          </p>
          
          {/* Display selected business category */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-blue-500/20 px-4 py-2 rounded-full">
              <span className="text-blue-400 text-sm font-medium">Your Category: </span>
              <span className="text-white text-sm font-semibold ml-1">
                {businessCategory ? businessCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not Selected'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-2 bg-red-900/30 text-red-300 p-4 rounded-xl backdrop-blur-md border border-red-500/20">
            <FileText className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="relative w-full md:w-1/2 max-w-md">
            <input 
              type="text" 
              placeholder="Search websites" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          </div>

          <div className="flex items-center text-white/60">
            <Filter size={18} className="mr-2" />
            <span className="text-sm">
              Showing {filteredWebsites.length} available website{filteredWebsites.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <Globe className="w-12 h-12 text-white/40 mb-4" />
                <p className="text-white/60 mb-4 text-center">
                  No websites available at the moment
                </p>
                <p className="text-white/40 text-sm text-center">
                  Please check back later or contact support
                </p>
              </div>
            ) : (
              filteredWebsites.map((website) => (
                <div 
                  key={website._id} 
                  onClick={() => handleSelect(website._id)}
                  className={`group backdrop-blur-md rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                    selectedWebsites.includes(website._id)
                      ? 'border-orange-500 bg-gradient-to-b from-orange-900/30 to-orange-900/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden ${
                        selectedWebsites.includes(website._id) ? 'bg-orange-500/20' : 'bg-white/10'
                      }`}>
                        <img 
                          src={website.imageUrl || '/global.png'} 
                          alt={`${website.websiteName} logo`} 
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/global.png';
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="text-lg font-semibold">{website.websiteName}</h3>
                        <p className="text-white/60 text-sm truncate">{website.websiteLink}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedWebsites.includes(website._id)
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 group-hover:bg-white/20 text-transparent group-hover:text-white/60'
                      }`}>
                        <Check size={16} />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        selectedWebsites.includes(website._id)
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {formatCategoryForDisplay(website.businessCategories)}
                      </span>
                      {/* Show match indicator - with safety check */}
                      {website.businessCategories && 
                       Array.isArray(website.businessCategories) &&
                       website.businessCategories.includes(businessCategory) && 
                       !website.businessCategories.includes('any') && (
                        <span className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedWebsites.includes(website._id)
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          Perfect Match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/60 text-sm">
            {selectedWebsites.length > 0 && (
              <span>{selectedWebsites.length} website{selectedWebsites.length !== 1 ? 's' : ''} selected</span>
            )}
          </div>
          
          <button
            onClick={handleNext} 
            disabled={selectedWebsites.length === 0}
            className={`w-full md:w-auto px-8 group relative h-14 rounded-xl text-white font-medium overflow-hidden transition-all duration-300 ${
              selectedWebsites.length === 0
                ? 'bg-white/10 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-rose-600'
            }`}
          >
            {selectedWebsites.length > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            <span className="relative z-10 flex items-center justify-center">
              {loading ? 'Processing...' : (
                <>
                  <span className="uppercase tracking-wider">Continue</span>
                  <PlusCircle size={16} className="ml-2" />
                </>
              )}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Websites;