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
            <Heading level={2}>Choose Where Your Ad Will Appear</Heading>
          </div>
  
          {/* Info Banner */}
          <div className="border border-black bg-white p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📍</div>
              <div>
                <Heading level={3} className="mb-2">Select Ad Placement Locations</Heading>
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
                <Info size={20} className="text-red-600" />
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
                          icon={LinkIcon}
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
                                    <Tag size={18} className="text-black" />
                                    <Heading level={4}>{category.categoryName}</Heading>
                                  </div>
                                  
                                  <Text className="mb-4">
                                    {category.description.length > 80 
                                      ? `${category.description.substring(0, 80)}...`
                                      : category.description
                                    }
                                  </Text>
  
                                  <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                      <DollarSign size={18} className="text-green-600" />
                                      <span className="text-lg font-semibold text-green-600">
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
  
                            {/* Expanded Description */}
                            {isExpanded && category.description.length > 80 && (
                              <div className="border-t border-gray-200 p-6 bg-gray-50">
                                <Heading level={5} className="mb-3">Full Description:</Heading>
                                <Text>{category.description}</Text>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-4xl mb-4">📭</div>
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
              <div className="text-6xl mb-6">🔍</div>
              <Heading level={2} className="mb-4">No Ad Spaces Found</Heading>
              <Text variant="muted" className="mb-8">
                The selected websites don't have any available ad placements. 
                Please try selecting different websites.
              </Text>
            </div>
          )}
          
          {/* Footer Actions */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <div className="mb-6">
              <Text variant="muted">
                Selected {selectedCategories.length} ad placement{selectedCategories.length !== 1 ? 's' : ''}
              </Text>
            </div>
            
            <Button 
              onClick={handleNext}
              disabled={selectedCategories.length === 0 || isSubmitting}
              loading={isSubmitting}
              variant="secondary"
              size="lg"
            >
              {isSubmitting ? 'Publishing Your Ad...' : 'Publish My Advertisement'}
            </Button>
          </div>
        </div>
      </div>
    );

  // return (
  //   <div>
  //     <header style={{ border: '1px solid #ccc', padding: '10px' }}>
  //       <button onClick={() => navigate(-1)}>
  //         <ArrowLeft size={18} />
  //         Back
  //       </button>
  //       <span>Choose Where Your Ad Will Appear</span>
  //     </header>

  //     <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
  //       <div style={{ 
  //         backgroundColor: '#e6f3ff', 
  //         padding: '20px', 
  //         marginBottom: '30px', 
  //         borderRadius: '8px',
  //         border: '1px solid #007bff'
  //       }}>
  //         <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
  //           📍 Select Ad Placement Locations
  //         </h3>
  //         <p style={{ margin: 0, color: '#333' }}>
  //           Choose where you want your advertisement to appear on each website. 
  //           Each location shows exactly where visitors will see your ad.
  //         </p>
  //       </div>

  //       {error && (
  //         <div style={{ 
  //           border: '1px solid red', 
  //           backgroundColor: '#ffe6e6', 
  //           padding: '15px', 
  //           marginBottom: '20px',
  //           borderRadius: '8px',
  //           display: 'flex',
  //           alignItems: 'center',
  //           gap: '10px'
  //         }}>
  //           <Info size={20} />
  //           <span>{typeof error === 'string' ? error : 'Please select at least one ad placement to proceed'}</span>
  //         </div>
  //       )}

  //       {isLoading ? (
  //         <div style={{ textAlign: 'center', padding: '100px 0' }}>
  //           <LoadingSpinner />
  //         </div>
  //       ) : categoriesByWebsite.length > 0 ? (
  //         <div style={{ 
  //           display: 'grid', 
  //           gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', 
  //           gap: '30px' 
  //         }}>
  //           {categoriesByWebsite.map((website) => (
  //             <div key={website.websiteName} style={{ 
  //               border: '2px solid #ddd', 
  //               borderRadius: '12px',
  //               overflow: 'hidden',
  //               backgroundColor: '#fff'
  //             }}>
  //               <div style={{ 
  //                 padding: '25px', 
  //                 borderBottom: '2px solid #ddd', 
  //                 backgroundColor: '#f8f9fa',
  //                 display: 'flex',
  //                 justifyContent: 'space-between',
  //                 alignItems: 'center'
  //               }}>
  //                 <div>
  //                   <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#333' }}>
  //                     {website.websiteName}
  //                   </h2>
  //                   <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
  //                     Available ad placements on this website
  //                   </p>
  //                 </div>
  //                 <a 
  //                   href={website.websiteLink} 
  //                   target="_blank" 
  //                   rel="noopener noreferrer"
  //                   style={{ 
  //                     color: '#007bff', 
  //                     textDecoration: 'none',
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                     gap: '5px',
  //                     padding: '8px 12px',
  //                     border: '1px solid #007bff',
  //                     borderRadius: '6px',
  //                     fontSize: '14px'
  //                   }}
  //                 >
  //                   <LinkIcon size={16} />
  //                   Visit Site
  //                 </a>
  //               </div>
                
  //               {website.categories.length > 0 ? (
  //                 <div style={{ padding: '25px' }}>
  //                   {website.categories.map((category) => {
  //                     const adImage = getAdSpaceImage(category.categoryName);
  //                     const isExpanded = expandedCategory === category._id;
                      
  //                     return (
  //                       <div
  //                         key={category._id}
  //                         style={{
  //                           border: selectedCategories.includes(category._id) ? '3px solid #007bff' : '2px solid #e0e0e0',
  //                           borderRadius: '12px',
  //                           marginBottom: '20px',
  //                           opacity: category.isFullyBooked ? 0.6 : 1,
  //                           backgroundColor: selectedCategories.includes(category._id) ? '#f0f8ff' : 'white',
  //                           position: 'relative',
  //                           overflow: 'hidden',
  //                           transition: 'all 0.3s ease'
  //                         }}
  //                       >
  //                         {category.isFullyBooked && (
  //                           <div style={{ 
  //                             position: 'absolute', 
  //                             top: '15px', 
  //                             right: '15px', 
  //                             backgroundColor: '#dc3545', 
  //                             color: 'white', 
  //                             padding: '6px 12px', 
  //                             fontSize: '12px',
  //                             borderRadius: '20px',
  //                             fontWeight: 'bold',
  //                             zIndex: 2
  //                           }}>
  //                             FULLY BOOKED
  //                           </div>
  //                         )}
                          
  //                         {/* Main clickable area */}
  //                         <div
  //                           onClick={() => 
  //                             !category.isFullyBooked && handleCategorySelection(category._id)
  //                           }
  //                           style={{
  //                             cursor: category.isFullyBooked ? 'not-allowed' : 'pointer',
  //                             padding: '20px'
  //                           }}
  //                         >
  //                           <div style={{ 
  //                             display: 'grid',
  //                             gridTemplateColumns: adImage ? '200px 1fr auto' : '1fr auto',
  //                             gap: '20px',
  //                             alignItems: 'center'
  //                           }}>
  //                             {/* Ad Space Preview Image */}
  //                             {adImage && (
  //                               <div style={{
  //                                 width: '200px',
  //                                 height: '120px',
  //                                 border: '2px solid #e0e0e0',
  //                                 borderRadius: '8px',
  //                                 overflow: 'hidden',
  //                                 backgroundColor: '#f8f9fa'
  //                               }}>
  //                                 <img 
  //                                   src={adImage} 
  //                                   alt={`${category.categoryName} placement preview`}
  //                                   style={{
  //                                     width: '100%',
  //                                     height: '100%',
  //                                     objectFit: 'cover'
  //                                   }}
  //                                 />
  //                               </div>
  //                             )}
                              
  //                             {/* Category Info */}
  //                             <div>
  //                               <div style={{ 
  //                                 display: 'flex', 
  //                                 alignItems: 'center', 
  //                                 gap: '10px',
  //                                 marginBottom: '10px'
  //                               }}>
  //                                 <Tag size={20} color="#007bff" />
  //                                 <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
  //                                   {category.categoryName}
  //                                 </h3>
  //                               </div>
                                
  //                               <p style={{ 
  //                                 margin: '0 0 15px 0', 
  //                                 color: '#666', 
  //                                 fontSize: '14px', 
  //                                 lineHeight: '1.5'
  //                               }}>
  //                                 {category.description.length > 80 
  //                                   ? `${category.description.substring(0, 80)}...`
  //                                   : category.description
  //                                 }
  //                               </p>

  //                               <div style={{ 
  //                                 display: 'flex', 
  //                                 alignItems: 'center', 
  //                                 gap: '15px',
  //                                 flexWrap: 'wrap'
  //                               }}>
  //                                 <div style={{ 
  //                                   display: 'flex', 
  //                                   alignItems: 'center', 
  //                                   gap: '8px'
  //                                 }}>
  //                                   <DollarSign size={18} color="#28a745" />
  //                                   <span style={{ 
  //                                     fontSize: '20px', 
  //                                     fontWeight: 'bold', 
  //                                     color: '#28a745' 
  //                                   }}>
  //                                     {category.price}
  //                                   </span>
  //                                 </div>
                                  
  //                                 {category.description.length > 80 && (
  //                                   <button 
  //                                     onClick={(e) => {
  //                                       e.stopPropagation();
  //                                       toggleCategoryExpansion(category._id);
  //                                     }}
  //                                     style={{ 
  //                                       background: 'none', 
  //                                       border: '1px solid #007bff', 
  //                                       color: '#007bff', 
  //                                       cursor: 'pointer',
  //                                       fontSize: '12px',
  //                                       padding: '4px 8px',
  //                                       borderRadius: '4px',
  //                                       display: 'flex',
  //                                       alignItems: 'center',
  //                                       gap: '4px'
  //                                     }}
  //                                   >
  //                                     <Eye size={14} />
  //                                     {isExpanded ? 'Show Less' : 'Read More'}
  //                                   </button>
  //                                 )}
  //                               </div>
  //                             </div>
                              
  //                             {/* Selection Indicator */}
  //                             <div style={{ textAlign: 'center' }}>
  //                               {selectedCategories.includes(category._id) ? (
  //                                 <div style={{ 
  //                                   width: '40px', 
  //                                   height: '40px', 
  //                                   backgroundColor: '#007bff', 
  //                                   borderRadius: '50%',
  //                                   display: 'flex',
  //                                   alignItems: 'center',
  //                                   justifyContent: 'center',
  //                                   margin: '0 auto'
  //                                 }}>
  //                                   <Check size={24} color="white" />
  //                                 </div>
  //                               ) : (
  //                                 <div style={{ 
  //                                   width: '40px', 
  //                                   height: '40px', 
  //                                   border: '2px solid #ddd', 
  //                                   borderRadius: '50%',
  //                                   margin: '0 auto'
  //                                 }} />
  //                               )}
  //                               <div style={{ 
  //                                 fontSize: '12px', 
  //                                 color: selectedCategories.includes(category._id) ? '#007bff' : '#666',
  //                                 marginTop: '8px',
  //                                 fontWeight: selectedCategories.includes(category._id) ? 'bold' : 'normal'
  //                               }}>
  //                                 {selectedCategories.includes(category._id) ? 'SELECTED' : 'SELECT'}
  //                               </div>
  //                             </div>
  //                           </div>
  //                         </div>

  //                         {/* Expanded Description */}
  //                         {isExpanded && category.description.length > 80 && (
  //                           <div style={{
  //                             borderTop: '1px solid #e0e0e0',
  //                             padding: '20px',
  //                             backgroundColor: '#f8f9fa'
  //                           }}>
  //                             <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Full Description:</h4>
  //                             <p style={{ 
  //                               margin: 0, 
  //                               color: '#666', 
  //                               lineHeight: '1.6',
  //                               fontSize: '14px'
  //                             }}>
  //                               {category.description}
  //                             </p>
  //                           </div>
  //                         )}
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //               ) : (
  //                 <div style={{ padding: '60px 40px', textAlign: 'center', color: '#666' }}>
  //                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
  //                   <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '0 0 10px 0' }}>
  //                     No Ad Spaces Available
  //                   </p>
  //                   <p style={{ fontSize: '14px', margin: 0 }}>
  //                     This website doesn't have any available ad placements right now. Check back later!
  //                   </p>
  //                 </div>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       ) : (
  //         <div style={{ textAlign: 'center', padding: '80px 40px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
  //           <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
  //           <p style={{ fontSize: '24px', color: '#666', margin: '0 0 15px 0' }}>
  //             No Ad Spaces Found
  //           </p>
  //           <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>
  //             The selected websites don't have any available ad placements. 
  //             Please try selecting different websites.
  //           </p>
  //         </div>
  //       )}
        
  //       <div style={{ 
  //         marginTop: '50px', 
  //         textAlign: 'center',
  //         borderTop: '2px solid #e0e0e0',
  //         paddingTop: '30px'
  //       }}>
  //         <div style={{ marginBottom: '20px' }}>
  //           <p style={{ color: '#666', margin: 0 }}>
  //             Selected {selectedCategories.length} ad placement{selectedCategories.length !== 1 ? 's' : ''}
  //           </p>
  //         </div>
          
  //         <button 
  //           onClick={handleNext}
  //           disabled={selectedCategories.length === 0 || isSubmitting}
  //           style={{
  //             padding: '18px 40px',
  //             border: 'none',
  //             borderRadius: '8px',
  //             backgroundColor: (selectedCategories.length === 0 || isSubmitting) ? '#ccc' : '#007bff',
  //             color: 'white',
  //             cursor: (selectedCategories.length === 0 || isSubmitting) ? 'not-allowed' : 'pointer',
  //             display: 'inline-flex',
  //             alignItems: 'center',
  //             gap: '10px',
  //             fontSize: '18px',
  //             fontWeight: 'bold',
  //             transition: 'background-color 0.3s ease'
  //           }}
  //         >
  //           {isSubmitting ? (
  //             <>
  //               <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
  //               Publishing Your Ad...
  //             </>
  //           ) : (
  //             <>
  //               🚀 Publish My Advertisement
  //             </>
  //           )}
  //         </button>
  //       </div>
  //     </main>
  //   </div>
  // );
};

export default Categories;