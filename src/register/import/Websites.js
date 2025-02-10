import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Check, Search, Filter, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/backToPreviousHeader';
import LoadingSpinner from '../../components/LoadingSpinner';

function Websites() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId, businessName, businessLink, businessLocation, adDescription } = location.state || {};
  
  const [websites, setWebsites] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/websites');
        const data = await response.json();
        
        setWebsites(data);
        setFilteredWebsites(data);
        const uniqueCategories = ['All', ...new Set(data.map(site => site.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch websites:', error);
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  useEffect(() => {
    let result = websites;
    
    if (searchTerm) {
      result = result.filter(site => 
        site.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.websiteLink.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(site => site.category === selectedCategory);
    }
    
    setFilteredWebsites(result);
  }, [searchTerm, selectedCategory, websites]);

  const handleSelect = (websiteId) => {
    setSelectedWebsites(prev => 
      prev.includes(websiteId) 
        ? prev.filter(id => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const handleNext = () => {
    if (selectedWebsites.length === 0) return;

    navigate('/categories', {
      state: {
        file,
        userId,
        businessName,
        businessLink,
        businessLocation,
        adDescription,
        selectedWebsites,
      },
    });
  };

  return (
    <div className='ad-waitlist min-h-screen'>
      <Header />
      <div className='max-w-7xl py-5 mx-auto'>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-6xl p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-blue-950 mb-2 font-bold">Choose Your Advertising Platforms</h1>
            <p className="text-gray-600">Select the websites that best match your target audience</p>
          </div>

          {error && (
            <div className="mt-4 mb-4 flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg">
              <FileText className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search websites" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Filter size={20} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-3 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWebsites.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center p-8">
                  <Globe className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">No websites found matching your search</p>
                </div>
              ) : (
                filteredWebsites.map((website) => (
                  <div 
                    key={website._id} 
                    className={`bg-gray-50 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-2 ${
                      selectedWebsites.includes(website._id) 
                        ? 'border-[#FF4500] bg-red-50/50' 
                        : 'border-transparent'
                    }`}
                    onClick={() => handleSelect(website._id)}
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={website.imageUrl || 'global.png'} 
                        alt={`${website.websiteName} logo`} 
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                      <div>
                        <h2 className="text-base font-medium mb-1">{website.websiteName}</h2>
                        <p className="text-xs text-gray-600">{website.websiteLink}</p>
                        <span className="inline-block bg-red-100 text-orange-500 px-2 py-1 rounded text-xs mt-2">
                          {website.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-[#FF4500]">
                      {selectedWebsites.includes(website._id) && <Check size={24} />}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <div className="text-gray-700 w-full mt-6">
              {selectedWebsites.length > 0 && (
                <span>{selectedWebsites.length} website{selectedWebsites.length !== 1 ? 's' : ''} selected</span>
              )}
            </div>
            <motion.button 
              onClick={handleNext} 
              disabled={selectedWebsites.length === 0}
              className={`w-full mt-6 px-3 py-2 rounded-lg font-bold text-white sm:text-base transition-all duration-300 ${
                selectedWebsites.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#FF4500] text-white hover:bg-orange-500 hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Processing...' : 'Next'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Websites;