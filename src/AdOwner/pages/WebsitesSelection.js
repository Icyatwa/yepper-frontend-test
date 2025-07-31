import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Check, Search, ArrowLeft } from 'lucide-react';
import { Button, Grid, Badge, LoadingSpinner } from '../../components/components';

function WebsiteSelection() {
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
          
          const relevantWebsites = data.filter(website => {
            const categories = website.businessCategories;
            if (!categories || !Array.isArray(categories)) {
              return false;
            }
  
            if (categories.includes('any')) {
              return true;
            }
            
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

  const formatCategoryForDisplay = (categories) => {
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

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex items-center">
        <LoadingSpinner className="mr-2" />
        <span className="text-gray-700">Loading websites...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          iconPosition="left"
          size="sm"
        >
          Back
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-4">Choose websites to advertise on</h1>
          
          {businessCategory && (
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 text-sm">
              <span className="text-gray-700">Your Category: </span>
              <span className="font-medium text-black ml-1">
                {businessCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 border border-red-300 bg-red-50 p-4 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200"
            />
          </div>
        </div>

        {filteredWebsites.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-black">No websites available</h2>
              <p className="text-gray-600">Please check back later</p>
            </div>
          </div>
        ) : (
          <Grid cols={3} gap={6}>
            {filteredWebsites.map((website) => (
              <div 
                key={website._id} 
                onClick={() => handleSelect(website._id)}
                className={`border p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  selectedWebsites.includes(website._id) 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    {website.imageUrl ? (
                      <img 
                        src={website.imageUrl} 
                        alt={website.websiteName}
                        className="w-10 h-10 object-contain mr-3"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/global.png';
                        }}
                      />
                    ) : (
                      <Globe size={40} className="mr-3 text-gray-500" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-black">{website.websiteName}</h3>
                      <p className="text-sm text-gray-600 break-all">{website.websiteLink}</p>
                    </div>
                  </div>
                  
                  <div className={`w-6 h-6 border flex items-center justify-center ${
                    selectedWebsites.includes(website._id) 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300'
                  }`}>
                    {selectedWebsites.includes(website._id) && <Check size={14} />}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" className="text-xs px-2 py-1 bg-black text-white">
                    {formatCategoryForDisplay(website.businessCategories)}
                  </Badge>
                  
                  {website.businessCategories && 
                   Array.isArray(website.businessCategories) &&
                   website.businessCategories.includes(businessCategory) && 
                   !website.businessCategories.includes('any') && (
                    <Badge variant="success" className="text-xs">
                      Perfect Match
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </Grid>
        )}

        <div className="flex justify-end items-center mt-12 gap-4">
          <Button
            onClick={handleNext} 
            disabled={selectedWebsites.length === 0}
            variant={selectedWebsites.length === 0 ? "outline" : "secondary"}
            size="lg"
          >
            {loading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WebsiteSelection;