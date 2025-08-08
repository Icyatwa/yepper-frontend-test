// SelectWebsitesForExistingAd.js - Page to add websites to existing ad
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SelectWebsitesForExistingAd() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adId, isReassignment, availableRefund } = location.state || {};
  const [ad, setAd] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    if (!adId) {
      navigate('/my-ads');
      return;
    }
    fetchAdDetails();
    fetchWebsites();
  }, [adId]);

  useEffect(() => {
    filterWebsites();
  }, [searchTerm, websites, ad]); // Added 'ad' dependency

  const fetchAdDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/web-advertise/${adId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setAd(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching ad details:', error);
      navigate('/my-ads');
    }
  };

  const fetchWebsites = async () => {
    try {
      console.log('Fetching websites from correct endpoint...');
      const response = await axios.get('http://localhost:5000/api/createWebsite', {
        headers: getAuthHeaders()
      });
      
      console.log('Response data:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      // Your controller returns a direct array
      if (Array.isArray(response.data)) {
        console.log('Found websites:', response.data.length);
        setWebsites(response.data);
      } else if (response.data.success && response.data.websites) {
        setWebsites(response.data.websites);
      } else {
        console.log('Unexpected response format');
        setWebsites([]);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
      console.error('Error response:', error.response?.data);
      setWebsites([]);
    } finally {
      setLoading(false);
    }
  };

  const filterWebsites = () => {
    if (!websites.length) return;
    
    let filtered = websites;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(website =>
        website.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.websiteLink.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // FIXED: Only filter out websites with ACTIVE or PENDING selections
    // Allow websites with rejected selections or no selections to be selectable
    if (ad?.websiteSelections?.length > 0) {
      const websitesWithActiveOrPendingSelections = ad.websiteSelections
        .filter(ws => 
          (ws.status === 'active' || ws.status === 'pending') && !ws.isRejected
        )
        .map(ws => ws.websiteId.toString());
      
      filtered = filtered.filter(website => 
        !websitesWithActiveOrPendingSelections.includes(website._id.toString())
      );
    }

    console.log('Filtered websites count:', filtered.length);
    console.log('Ad selections:', ad?.websiteSelections);
    
    setFilteredWebsites(filtered);
  };

  const handleSelect = (websiteId) => {
    setSelectedWebsites(prev => 
      prev.includes(websiteId)
        ? prev.filter(id => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const handleNext = () => {
    if (selectedWebsites.length === 0) return;

    navigate('/select-categories-for-ad', {
      state: {
        adId,
        selectedWebsites,
        ad,
        isReassignment,
        availableRefund
      }
    });
  };

  const getWebsiteStatus = (website) => {
    if (!ad?.websiteSelections) return null;
    
    const selection = ad.websiteSelections.find(
      ws => ws.websiteId.toString() === website._id.toString()
    );
    
    if (!selection) return null;
    
    if (selection.isRejected || selection.status === 'rejected') {
      return {
        status: 'rejected',
        text: 'Previously Rejected',
        className: 'bg-red-100 text-red-800 px-2 py-1 rounded text-sm'
      };
    }
    
    if (selection.status === 'active') {
      return {
        status: 'active',
        text: 'Currently Active',
        className: 'bg-green-100 text-green-800 px-2 py-1 rounded text-sm'
      };
    }
    
    if (selection.status === 'pending') {
      return {
        status: 'pending',
        text: 'Pending Approval',
        className: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm'
      };
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-ads')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to My Ads
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {isReassignment ? 'Reassign Ad to New Websites' : 'Add Websites to Your Ad'}
          </h1>
          
          {ad && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h2 className="text-lg font-semibold text-gray-900">{ad.businessName}</h2>
              <p className="text-gray-600 mt-1">{ad.adDescription}</p>
              {availableRefund > 0 && (
                <div className="mt-2 text-green-600 font-medium">
                  Available Refund: ${availableRefund}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search websites by name or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Available websites count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredWebsites.length} websites available for selection
          </p>
          {selectedWebsites.length > 0 && (
            <p className="text-blue-600 font-medium">
              {selectedWebsites.length} website{selectedWebsites.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Websites Grid */}
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm ? 'No websites found matching your search.' : 'No websites available for selection.'}
            </div>
            {!searchTerm && ad?.websiteSelections?.length > 0 && (
              <p className="text-gray-400 mt-2">
                All websites may already have active or pending selections for this ad.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredWebsites.map((website) => {
              const isSelected = selectedWebsites.includes(website._id);
              const status = getWebsiteStatus(website);
              
              return (
                <div
                  key={website._id}
                  className={`bg-white rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelect(website._id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {website.websiteName}
                      </h3>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <a
                      href={website.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {website.websiteLink}
                    </a>
                    
                    <div className="mt-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Visitors:</span> {website.monthlyVisitors || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Categories:</span> {website.categoryCount || 0}
                      </div>
                    </div>

                    {status && (
                      <div className="mt-3">
                        <span className={status.className}>
                          {status.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Button */}
        {selectedWebsites.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Continue to Categories ({selectedWebsites.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectWebsitesForExistingAd;