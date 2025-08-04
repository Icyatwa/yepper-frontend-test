// AvailableAds.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, DollarSign, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';

const AvailableAds = () => {
  const navigate = useNavigate();
  const [availableAds, setAvailableAds] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    if (selectedWebsite) {
      fetchCategories(selectedWebsite);
    }
  }, [selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite && selectedCategory) {
      fetchAvailableAds();
    }
  }, [selectedWebsite, selectedCategory]);

  const fetchWebsites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/createWebsite', {
        headers: getAuthHeaders()
      });
      setWebsites(response.data.websites || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  };

  const fetchCategories = async (websiteId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ad-categories/${websiteId}`, {
        headers: getAuthHeaders()
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAvailableAds = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/web-advertise/available', {
        params: {
          websiteId: selectedWebsite,
          categoryId: selectedCategory
        },
        headers: getAuthHeaders()
      });
      
      setAvailableAds(response.data.availableAds || []);
    } catch (error) {
      console.error('Error fetching available ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAd = async (adId) => {
    setAssigning(adId);
    try {
      await axios.post('http://localhost:5000/api/web-advertise/assign', {
        adId,
        categoryId: selectedCategory,
        websiteId: selectedWebsite
      }, {
        headers: getAuthHeaders()
      });

      // Refresh available ads
      await fetchAvailableAds();
      
      alert('Ad assigned successfully! It will be active for 2 minutes before auto-approval.');
      
    } catch (error) {
      console.error('Error assigning ad:', error);
      alert(error.response?.data?.error || 'Failed to assign ad');
    } finally {
      setAssigning(null);
    }
  };

  const filteredAds = availableAds.filter(ad =>
    ad.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.adDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.businessLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Advertisements</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Website:</label>
            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose a website...</option>
              {websites.map(website => (
                <option key={website._id} value={website._id}>
                  {website.websiteName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Ad Space:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!selectedWebsite}
            >
              <option value="">Choose ad space...</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.categoryName} - ${category.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Search Ads:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by business name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Ads */}
      {!selectedWebsite || !selectedCategory ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">Please select a website and ad space to view available advertisements.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : filteredAds.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No available ads found for your selected criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAds.map(ad => (
            <div key={ad._id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {ad.imageUrl && (
                      <img
                        src={ad.imageUrl}
                        alt={ad.businessName}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{ad.businessName}</h3>
                      <p className="text-gray-600 mb-3">{ad.adDescription}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {ad.businessLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </span>
                        <span>👀 {ad.views} views</span>
                        <span>🖱️ {ad.clicks} clicks</span>
                      </div>

                      {ad.availableForReassignment && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3">
                          <p className="text-yellow-800 text-sm">
                            ⚠️ This ad was previously rejected and is now available for reassignment
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600">FREE</div>
                    <div className="text-sm text-gray-500">No payment required</div>
                  </div>
                  
                  <button
                    onClick={() => handleAssignAd(ad._id)}
                    disabled={assigning === ad._id}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {assigning === ad._id ? (
                      'Assigning...'
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Assign to My Site
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableAds;