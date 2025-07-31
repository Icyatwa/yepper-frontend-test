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
  ArrowLeft,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { Button, Text, Heading } from '../../components/components';

// Import ad space images
import AboveTheFold from '../img/aboveTheFold.png';
import BeneathTitle from '../img/beneathTitle.png';
import Bottom from '../img/bottom.png';
import Floating from '../img/floating.png';
import HeaderPic from '../img/header.png';
import InFeed from '../img/inFeed.png';
import InlineContent from '../img/inlineContent.png';
import LeftRail from '../img/leftRail.png';
import MobileInterstial from '../img/mobileInterstitial.png';
import ModalPic from '../img/modal.png';
import Overlay from '../img/overlay.png';
import ProFooter from '../img/proFooter.png';
import RightRail from '../img/rightRail.png';
import Sidebar from '../img/sidebar.png';
import StickySidebar from '../img/stickySidebar.png';

const Categories = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    file,
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
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  const adOwnerEmail = user?.email;

  // Map category names to their corresponding images
  const getAdSpaceImage = (categoryName) => {
    const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '');
    
    const imageMap = {
      'abovethefold': AboveTheFold,
      'beneathtitle': BeneathTitle,
      'bottom': Bottom,
      'floating': Floating,
      'header': HeaderPic,
      'infeed': InFeed,
      'inlinecontent': InlineContent,
      'leftrail': LeftRail,
      'mobileinterstitial': MobileInterstial,
      'modal': ModalPic,
      'overlay': Overlay,
      'profooter': ProFooter,
      'rightrail': RightRail,
      'sidebar': Sidebar,
      'stickysidebar': StickySidebar
    };

    return imageMap[normalizedName] || null;
  };

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
          const websiteResponse = await fetch(`http://localhost:5000/api/createWebsite/website/${websiteId}`);
          const websiteData = await websiteResponse.json();
          
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

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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
      if (file) formData.append('file', file);
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

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };

      const response = await axios.post('http://localhost:5000/api/web-advertise', formData, config);

      if (response.data.success) {
        navigate('/dashboard');
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

  if (!user && getAuthToken()) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              icon={ArrowLeft}
              iconPosition="left"
            >
              Back
            </Button>
          </div>
  
          {/* Info Banner */}
          <div className="border border-black bg-white p-6 mb-8">
            <div className="flex items-start gap-3">
              <div>
                <Heading level={3} className="mb-2">Choose Where Your Ad Will Appear</Heading>
                <Text>
                  Choose where you want your advertisement to appear on each website. 
                  Each location shows exactly where visitors will see your ad.
                </Text>
              </div>
            </div>
          </div>
  
          {/* Error Message */}
          {error && (
            <div className="border border-red-600 bg-red-50 p-4 mb-8">
              <div className="flex items-center gap-3">
                <Text variant="error">
                  {typeof error === 'string' ? error : 'Please select at least one ad placement to proceed'}
                </Text>
              </div>
            </div>
          )}
  
          {/* Categories Grid */}
          {categoriesByWebsite.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {categoriesByWebsite.map((website) => (
                <div key={website.websiteName} className="border border-black bg-white">
                  {/* Website Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <Heading level={3} className="mb-1">{website.websiteName}</Heading>
                        <Text variant="muted">Available ad placements on this website</Text>
                      </div>
                      <a 
                        href={website.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          iconPosition="left"
                        >
                          Visit Site
                        </Button>
                      </a>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  {website.categories.length > 0 ? (
                    <div className="p-6 space-y-6">
                      {website.categories.map((category) => {
                        const adImage = getAdSpaceImage(category.categoryName);
                        const isExpanded = expandedCategory === category._id;
                        const isSelected = selectedCategories.includes(category._id);
                        
                        return (
                          <div
                            key={category._id}
                            className={`border transition-all duration-200 bg-white relative ${
                              isSelected ? 'border-black' : 'border-gray-300'
                            } ${category.isFullyBooked ? 'opacity-60' : ''}`}
                          >
                            {category.isFullyBooked && (
                              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-medium z-10">
                                FULLY BOOKED
                              </div>
                            )}
                            
                            {/* Main Content */}
                            <div
                              onClick={() => !category.isFullyBooked && handleCategorySelection(category._id)}
                              className={`p-6 ${category.isFullyBooked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                            >
                              <div className={`grid gap-6 items-center ${adImage ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4'}`}>
                                {/* Ad Preview Image */}
                                {adImage && (
                                  <div className="w-full h-32 border border-gray-300 bg-gray-50 overflow-hidden">
                                    <img 
                                      src={adImage} 
                                      alt={`${category.categoryName} placement preview`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                {/* Category Info */}
                                <div className={adImage ? 'md:col-span-2' : 'md:col-span-3'}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <Heading level={4}>{category.categoryName}</Heading>
                                  </div>
                                  
                                  <Text className="mb-4">
                                    {category.description.length > 80 
                                      ? `${category.description.substring(0, 80)}...`
                                      : category.description
                                    }
                                  </Text>
  
                                  <div className="flex items-center gap-6">
                                    <div className="flex items-center justify-center gap-2">
                                      <DollarSign size={18} className="text-black" />
                                      <span className="text-lg font-semibold text-black">
                                        {category.price}
                                      </span>
                                    </div>
                                    
                                    {category.description.length > 80 && (
                                      <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleCategoryExpansion(category._id);
                                        }}
                                        icon={Eye}
                                        iconPosition="left"
                                      >
                                        {isExpanded ? 'Show Less' : 'Read More'}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Selection Indicator */}
                                <div className="text-center">
                                  <div className={`w-10 h-10 border-2 flex items-center justify-center mx-auto mb-2 ${
                                    isSelected ? 'bg-black border-black' : 'border-gray-300'
                                  }`}>
                                    {isSelected && <Check size={20} className="text-white" />}
                                  </div>
                                  <Text 
                                    variant="small" 
                                    className={`font-medium ${isSelected ? 'text-black' : 'text-gray-500'}`}
                                  >
                                    {isSelected ? 'SELECTED' : 'SELECT'}
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <Heading level={4} className="mb-2">No Ad Spaces Available</Heading>
                      <Text variant="muted">
                        This website doesn't have any available ad placements right now. Check back later!
                      </Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heading level={2} className="mb-4">No Ad Spaces Found</Heading>
              <Text variant="muted" className="mb-8">
                The selected websites don't have any available ad placements. 
                Please try selecting different websites.
              </Text>
            </div>
          )}
          
          {/* Footer Actions */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <Button 
              onClick={handleNext}
              disabled={selectedCategories.length === 0 || isSubmitting}
              loading={isSubmitting}
              variant="secondary"
              size="lg"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    );
};

export default Categories;