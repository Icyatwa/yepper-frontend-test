// Categories.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LinkIcon,
  Check,
  Tag,
  DollarSign,
  Info,
  X,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';

const Categories = () => {
  const [hoverCategory, setHoverCategory] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    file,
    userId,
    businessName,
    businessLink,
    businessLocation,
    adDescription,
    selectedWebsites
  } = location.state || {};

  const [categoriesByWebsite, setCategoriesByWebsite] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const adOwnerEmail = user?.email;

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

  // Add useEffect to get user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const promises = selectedWebsites.map(async (websiteId) => {
          // Website endpoint (no auth required)
          const websiteResponse = await fetch(`http://localhost:5000/api/createWebsite/website/${websiteId}`);
          const websiteData = await websiteResponse.json();
          
          // Categories endpoint (auth required) - ADD AUTHORIZATION HEADER
          const categoriesResponse = await fetch(
            `http://localhost:5000/api/ad-categories/${websiteId}/advertiser`,
            {
              headers: getAuthHeaders()
            }
          );
          
          if (!categoriesResponse.ok) {
            if (categoriesResponse.status === 401) {
              console.error('Authentication required. Please log in.');
              navigate('/login');
              return;
            }
            throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
          }
          
          const categoriesData = await categoriesResponse.json();

          return {
            websiteName: websiteData.websiteName || 'Unknown Website',
            websiteLink: websiteData.websiteLink || '#',
            categories: categoriesData.categories || [],
          };
        });
        
        const result = await Promise.all(promises);
        setCategoriesByWebsite(result.filter(Boolean));
        
      } catch (error) {
        console.error('Failed to fetch categories or websites:', error);
        setError('Failed to load categories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      navigate('/login');
      return;
    }

    if (selectedWebsites) fetchCategories();
  }, [selectedWebsites, navigate]);

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId) 
        ? prevSelected.filter((id) => id !== categoryId) 
        : [...prevSelected, categoryId]
    );
    setError(false);
  };

  const handleNext = async(e) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('adOwnerEmail', user?.email);
      if (file) formData.append('file', file); // Only append if file exists
      formData.append('businessName', businessName);
      formData.append('businessLink', businessLink);
      formData.append('businessLocation', businessLocation);
      formData.append('adDescription', adDescription);
      formData.append('selectedWebsites', JSON.stringify(selectedWebsites));
      formData.append('selectedCategories', JSON.stringify(selectedCategories));

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // For FormData, don't set Content-Type header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove Content-Type to let browser set it with boundary
        }
      };

      const response = await axios.post('http://localhost:5000/api/web-advertise', formData, config);

      if (response.data.success) {
        navigate('/dashboard'); // or wherever you want to redirect
      }
      
    } catch (error) {
      console.error('Error during ad upload:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      const errorMessage = error.response?.data?.message || 'An error occurred while uploading the ad';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Don't render until user is loaded
  if (!user && getAuthToken()) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-6 py-20">
        {error && (
          <div className="max-w-6xl mx-auto mb-8 flex items-center gap-3 text-red-400 bg-red-900/20 border border-red-800/30 p-4 rounded-xl backdrop-blur-sm">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Please select at least one category to proceed</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : categoriesByWebsite.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {categoriesByWebsite.map((website) => (
              <div 
                key={website.websiteName} 
                className="backdrop-blur-md bg-white/5 rounded-3xl overflow-hidden border border-white/10 transition-all duration-300"
              >
                <div className="p-6 flex justify-between items-center border-b border-white/10 bg-gradient-to-r from-orange-900/30 to-orange-900/10">
                  <h2 className="text-xl font-bold text-white">{website.websiteName}</h2>
                  <a 
                    href={website.websiteLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 rounded-lg transition-colors"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </a>
                </div>
                
                {website.categories.length > 0 ? (
                  <div className="p-6 grid gap-4">
                    {website.categories.map((category) => (
                      <div
                        key={category._id}
                        onClick={() => 
                          !category.isFullyBooked && handleCategorySelection(category._id)
                        }
                        onMouseEnter={() => setHoverCategory(category._id)}
                        onMouseLeave={() => setHoverCategory(null)}

                        className={`group relative flex flex-col rounded-xl p-5 border transition-all duration-500 cursor-pointer${
                          category.isFullyBooked 
                                ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                                : 'cursor-pointer hover:shadow-lg'
                          }
                          ${selectedCategories.includes(category._id)
                            ? 'border-orange-500 bg-orange-900/20 scale-[1.02]'
                            : 'border-white/10 hover:border-white/30'
                          }
                          ${hoverCategory === category._id ? 'shadow-lg shadow-orange-500/20' : ''}
                        `}
                      >
                        {category.isFullyBooked && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Fully Booked
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                              <Tag className="w-5 h-5 text-orange-400" />
                            </div>
                            <h3 className="font-semibold text-white">
                              {category.categoryName}
                            </h3>
                          </div>
                          {selectedCategories.includes(category._id) && (
                            <div className="p-1 bg-orange-500 rounded-full">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-2 mb-4">
                          <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                            {category.description}
                          </p>
                          {category.description.length > 100 && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDescription(category.description);
                              }}
                              className="flex-shrink-0 p-1 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors z-10"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                            <div className="relative p-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                              <DollarSign className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <span className="text-lg font-semibold text-white">{category.price}</span>
                          {category.isFullyBooked && (
                            <span className="ml-2 text-sm text-red-500">(Space Full)</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-white/50">
                    <p className="font-medium">No spaces available</p>
                    <p className="text-sm text-white/30 mt-1">Check back later for updates</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium text-white/70">No spaces available</p>
            <p className="text-white/50 mt-3">Please select different websites and try again</p>
          </div>
        )}
        
        <div className="mt-16 flex justify-center">
          <button 
            onClick={handleNext}
            disabled={selectedCategories.length === 0 || isSubmitting}
            className={`group relative h-16 px-10 rounded-xl font-medium overflow-hidden transition-all duration-300
              ${(selectedCategories.length === 0 || isSubmitting)
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-rose-600 text-white hover:shadow-lg hover:orange-blue-500/30 hover:-translate-y-0.5'
              }`}
          >
            {selectedCategories.length > 0 && !isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            <span className="relative z-10 flex items-center justify-center uppercase tracking-wider">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Categories;