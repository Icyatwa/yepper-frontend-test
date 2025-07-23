import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    Info, 
    Check, 
    Users,
    X,
    FileText,
    ArrowRight,
    Monitor,
    Smartphone,
    Sidebar as SidebarIcon,
    Layers,
    PanelRight,
    PanelLeft,
    AlignJustify,
    PanelBottom,
    PieChart,
    Layout,
    Maximize,
    Star,
    Search
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/card";
import PricingTiers from '../components/PricingTiers';
import CategoryInfoModal from '../components/CategoryInfoModal';

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

const CategoryCreation = () => {
  const [user, setUser] = useState(null); // NEW: Custom user state
  const [loading, setLoading] = useState(true); // NEW: Loading state for auth check
  const { websiteId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [websiteDetails] = useState(state?.websiteDetails || null);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [completedCategories, setCompletedCategories] = useState([]);
  const [activeInfoModal, setActiveInfoModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage

        // Verify token and get user data
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUser(response.data.user); // Set user data from your API
        setLoading(false);
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('token'); // Remove invalid token
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!websiteId) {
        navigate('/create-website');
        return;
    }

    if (!websiteDetails) {
        const fetchWebsiteDetails = async () => {
            try {
                // CHANGED: Added authorization header for API calls
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/websites/${websiteId}`, {
                  headers: {
                    'Authorization': `Bearer ${token}` // NEW: Added auth header
                  }
                });
                // Handle the website details...
            } catch (error) {
                console.error('Failed to fetch website details:', error);
                navigate('/create-website');
            }
        };
        fetchWebsiteDetails();
    }
  }, [websiteId, websiteDetails, navigate]);

  const isCategoryDataEmpty = (category) => {
      const data = categoryData[category];
      return !data || 
             (!data.price && !data.userCount && !data.instructions);
  };

  useEffect(() => {
      completedCategories.forEach(category => {
          if (isCategoryDataEmpty(category)) {
              setCompletedCategories(prev => 
                  prev.filter(cat => cat !== category)
              );
          }
      });
  }, [categoryData, completedCategories]);

  const categoryDetails = useMemo(() => ({
      aboveTheFold: {
          name: 'Above the Fold',
          icon: <Layers className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Above The Fold",
          description: "Prime visibility area at the top of webpage before scrolling",
          visualization: "/api/placeholder/300/120",
          category: "primary",
          position: "top",
          image: AboveTheFold
      },
      beneathTitle: {
          name: 'Beneath Title',
          icon: <AlignJustify className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Beneath Title",
          description: "Ad space directly below the page title",
          visualization: "/api/placeholder/300/120",
          category: "content",
          position: "top",
          image: BeneathTitle

      },
      bottom: {
          name: 'Bottom',
          icon: <PanelBottom className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Bottom",
          description: "Ad placement at the bottom of the webpage",
          visualization: "/api/placeholder/300/120",
          category: "secondary",
          position: "bottom",
          image: Bottom
      },
      floating: {
          name: 'Floating',
          icon: <Maximize className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Floating",
          description: "Ads that float over page content, follows user scrolling",
          visualization: "/api/placeholder/300/120",
          category: "special",
          position: "overlay",
          image: Floating
      },
      HeaderPic: {
          name: 'Header',
          icon: <Monitor className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Header",
          description: "Banner ad space in the header section of the website",
          visualization: "/api/placeholder/300/120",
          category: "primary",
          position: "top",
          image: HeaderPic
      },
      inFeed: {
          name: 'In Feed',
          icon: <Layout className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "In Feed",
          description: "Native ad placement within content feeds",
          visualization: "/api/placeholder/300/120",
          category: "content",
          position: "middle",
          image: InFeed
      },
      inlineContent: {
          name: 'Inline Content',
          icon: <AlignJustify className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Inline Content",
          description: "Ad placement directly within article text",
          visualization: "/api/placeholder/300/120",
          category: "content",
          position: "middle",
          image: InlineContent
      },
      leftRail: {
          name: 'Left Rail',
          icon: <PanelLeft className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Left Rail",
          description: "Ad space along the left side of the webpage",
          visualization: "/api/placeholder/300/120",
          category: "sidebar",
          position: "left",
          image: LeftRail
      },
      mobileInterstial: {
          name: 'Mobile Interstitial',
          icon: <Smartphone className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "Mobile Interstitial",
          description: "Full-screen mobile ads that appear between content",
          visualization: "/api/placeholder/300/120",
          category: "mobile",
          position: "overlay",
          image: MobileInterstial
      },
      modalPic: {
          name: 'Modal',
          icon: <Info className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "modalPic",
          description: "Pop-up ad that appears in a modal window",
          visualization: "/api/placeholder/300/120",
          category: "special",
          position: "overlay",
          image: ModalPic
      },
      overlay: {
          name: 'Overlay',
          icon: <Layers className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "overlay",
          description: "Ad that overlays on top of page content",
          visualization: "/api/placeholder/300/120",
          category: "special",
          position: "overlay",
          image: Overlay
      },
      proFooter: {
          name: 'Pro Footer',
          icon: <PanelBottom className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "proFooter",
          description: "Premium ad space in the footer section",
          visualization: "/api/placeholder/300/120",
          category: "secondary",
          position: "bottom",
          image: ProFooter
      },
      rightRail: {
          name: 'Right Rail',
          icon: <PanelRight className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "rightRail",
          description: "Ad space along the right side of the webpage",
          visualization: "/api/placeholder/300/120",
          category: "sidebar",
          position: "right",
          image: RightRail
      },
      sidebar: {
          name: 'Sidebar',
          icon: <SidebarIcon className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "sidebar",
          description: "Ad placement in the website sidebar",
          visualization: "/api/placeholder/300/120",
          category: "sidebar",
          position: "side",
          image: Sidebar
      },
      stickySidebar: {
          name: 'Sticky Sidebar',
          icon: <PieChart className="w-6 h-6" />,
          infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
          spaceType: "stickySidebar",
          description: "Sidebar ad that stays visible as user scrolls",
          visualization: "/api/placeholder/300/120",
          category: "sidebar",
          position: "side",
          image: StickySidebar
      },
  }), []);

  const filteredCategories = useMemo(() => {
      return Object.entries(categoryDetails).filter(([key, value]) => {
          const matchesSearch = value.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  value.description.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter = activeFilter === 'all' || value.category === activeFilter;
          return matchesSearch && matchesFilter;
      });
  }, [categoryDetails, searchTerm, activeFilter]);

  const handleInfoClick = (e, category) => {
      e.stopPropagation();
      setActiveInfoModal(category);
  };

  const handleCategorySelect = (category) => {
      setActiveCategory(category);
      if (!selectedCategories[category]) {
          setSelectedCategories(prev => ({
              ...prev,
              [category]: true
          }));
      }
  };

  const handleCloseModal = () => {
      setActiveCategory(null);
  };

  const handleUnselect = (e, category) => {
      e.stopPropagation(); // Prevent modal from opening
      setCompletedCategories(prev => prev.filter(cat => cat !== category));
      setCategoryData(prev => ({
          ...prev,
          [category]: {}
      }));
  };

  const updateCategoryData = (category, field, value) => {
      if (field === 'price') {
          // value will now be an object containing price, tier, and visitorRange
          setCategoryData(prev => ({
              ...prev,
              [category]: {
                  ...prev[category],
                  price: value.price,
                  tier: value.tier,
                  visitorRange: value.visitorRange
              }
          }));
          } else {
              // Handle other fields normally
              setCategoryData(prev => ({
                  ...prev,
                  [category]: {
                      ...prev[category],
                      [field]: value
                  }
          }));
      }
  };

  const handleNext = () => {
      if (activeCategory && !isCategoryDataEmpty(activeCategory)) {
          setCompletedCategories(prev => 
              prev.includes(activeCategory) 
                  ? prev 
                  : [...prev, activeCategory]
          );
      }
      setActiveCategory(null);
  };

  // Fixed handleSubmit method for CategoryCreation.js
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const categoriesToSubmit = Object.entries(selectedCategories)
        .filter(([category]) => completedCategories.includes(category))
        .map(([category]) => {
          const data = categoryData[category] || {};
          const details = categoryDetails[category] || {};
          
          // Ensure proper data structure
          return {
            websiteId: websiteId, // Make sure this is a valid ObjectId
            categoryName: category.charAt(0).toUpperCase() + category.slice(1),
            description: details.description || '',
            price: Number(data.price) || 0, // Ensure it's a number
            spaceType: details.spaceType || 'banner', // Required field
            userCount: Number(data.userCount) || 0,
            instructions: data.instructions || '',
            customAttributes: data.customAttributes || {},
            // Required fields that were missing or incorrectly structured
            visitorRange: {
              min: Number(data.visitorRange?.min) || 0,
              max: Number(data.visitorRange?.max) || 10000
            },
            tier: data.tier || 'bronze' // Must be one of: bronze, silver, gold, platinum
          };
        });

      console.log('Categories to submit:', categoriesToSubmit); // Debug log

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        navigate('/login');
        return;
      }

      const responses = await Promise.all(
        categoriesToSubmit.map(async (category) => {
          try {
            const response = await axios.post(
              'http://localhost:5000/api/ad-categories', 
              category, 
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            return { ...response.data, name: category.categoryName };
          } catch (error) {
            console.error(`Failed to create category ${category.categoryName}:`, error.response?.data);
            throw error;
          }
        })
      );

      const categoriesWithId = responses.reduce((acc, category) => {
        acc[category.name.toLowerCase()] = { 
          id: category.category?._id || category._id, // Handle different response structures
          price: category.category?.price || category.price,
          apiCodes: category.category?.apiCodes || category.apiCodes
        };
        return acc;
      }, {});

      navigate('/projects', {
        state: {
          websiteId,
          websiteDetails,
          selectedCategories: categoriesWithId,
          categoryData
        },
      });
    } catch (error) {
      console.error('Failed to submit categories:', error);
      
      // Handle specific error types
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 400) {
        console.error('Validation error:', error.response.data);
        // Show user-friendly error message
        alert(`Validation failed: ${error.response.data.message || 'Please check your form data'}`);
      } else {
        alert('Failed to create categories. Please try again.');
      }
    }
  };

  const renderCategoryModal = () => {
    if (!activeCategory) return null;
    
    const details = categoryDetails[activeCategory];
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <Card className="w-full max-h-[90vh] bg-black text-white overflow-hidden flex flex-col border border-white/10 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-rose-600 text-white shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {details.icon}
                <span>{details.name} Ad Space</span>
              </CardTitle>
              <button 
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </CardHeader>
          <div className="overflow-y-auto bg-black/90">
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 flex flex-col justify-center">
                  <div className="bg-red/5 p-3 rounded-xl mb-2 border border-white/10">
                    <img 
                      src={details.image} 
                      alt={`${details.name} visualization`}
                      className="w-[200px] rounded-lg"
                    />
                  </div>
                  <div className="text-xs text-white/50 italic">
                    * Visual representation of ad placement
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-medium text-white/90 mb-1">Description:</h3>
                  <p className="text-sm text-white/70 mb-4">{details.description}</p>
                  
                  <h3 className="font-medium text-white/90 mb-1">Best For:</h3>
                  <ul className="space-y-2 text-sm text-white/70 mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                        <Star size={14} className="text-orange-400" />
                      </div>
                      <span>Position: {details.position}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                        <Star size={14} className="text-orange-400" />
                      </div>
                      <span>Type: {details.category}</span>
                    </div>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <PricingTiers 
                  selectedPrice={categoryData[activeCategory] || {}}
                  onPriceSelect={(price) => updateCategoryData(activeCategory, 'price', price)}
                />

                <div className="flex items-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Estimated user count"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-white"
                    value={categoryData[activeCategory]?.userCount || ''}
                    onChange={(e) => updateCategoryData(activeCategory, 'userCount', e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <textarea
                    placeholder="Additional instructions (size requirements, restrictions, etc.)"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-white"
                    value={categoryData[activeCategory]?.instructions || ''}
                    onChange={(e) => updateCategoryData(activeCategory, 'instructions', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleNext}
                  className="group relative h-16 px-8 bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium rounded-xl overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="uppercase tracking-wider mr-2">Save & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  };

  const categoryFilters = [
    { id: 'all', name: 'All Spaces' },
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'sidebar', name: 'Sidebar' },
    { id: 'content', name: 'Content' },
    { id: 'special', name: 'Special' },
    { id: 'mobile', name: 'Mobile' },
  ];

  return (
    <>
      <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
              <div className="mb-24">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-px w-12 bg-blue-500 mr-6"></div>
                  <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Ad Space Selection</span>
                  <div className="h-px w-12 bg-blue-500 ml-6"></div>
                </div>
                
                <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Select Your Ad Spaces
                  </span>
                </h1>
                
                <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-6">
                  Choose and configure the perfect locations to showcase ads on your website for maximum engagement and revenue.
                </p>
              </div>
              
              <div className="mb-10 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search ad spaces..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                  </div>
                </div>
                <div className="w-full flex overflow-x-auto pb-2 gap-2">
                  {categoryFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-9 py-1 rounded-full text-xs transition-all ${
                        activeFilter === filter.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="backdrop-blur-md bg-white/5 rounded-3xl overflow-hidden border border-white/10 p-8 mb-16">
                <div className="text-sm font-medium text-white/70 mb-8">
                  {completedCategories.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <span>Selected {completedCategories.length} ad spaces</span>
                      <span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs border border-green-500/30">
                        {completedCategories.length} ready
                      </span>
                    </div>
                  ) : (
                    <div>Click on ad spaces below to configure them</div>
                  )}
                </div>
              
                <form onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredCategories.map(([category, details]) => (
                      <div 
                        key={category}
                        className={`group relative backdrop-blur-md rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                          completedCategories.includes(category)
                            ? 'border-green-500/50 bg-gradient-to-b from-green-900/20 to-green-900/5'
                            : 'border-white/10 bg-gradient-to-b from-blue-900/20 to-blue-900/5 hover:shadow-lg'
                        }`}
                        style={{
                          boxShadow: completedCategories.includes(category) 
                            ? '0 0 20px rgba(34, 197, 94, 0.2)' 
                            : 'none'
                        }}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                        
                        <div className="p-6 relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                                <div className={`relative p-3 rounded-full ${
                                  completedCategories.includes(category)
                                    ? 'bg-gradient-to-r from-green-600 to-green-400'
                                    : 'bg-gradient-to-r from-orange-600 to-orange-400'
                                }`}>
                                  {completedCategories.includes(category) ? (
                                    <Check className="text-white" size={20} />
                                  ) : (
                                    details.icon
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="uppercase text-xs font-semibold text-orange-400 tracking-widest mb-1">
                                  {details.category}
                                </div>
                                <h2 className="text-xl font-bold">{details.name}</h2>
                              </div>
                            </div>
                            
                            {!completedCategories.includes(category) && (
                              <div 
                                onClick={(e) => handleInfoClick(e, category)}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <Info className="w-5 h-5 text-white/70" />
                              </div>
                            )}
                          </div>
                          
                          <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
                            <img 
                              src={details.image} 
                              alt={`${details.name} visualization`}
                              className="w-full h-40 object-cover"
                            />
                          </div>
                          
                          <p className="text-white/70 mb-6 text-sm">
                            {details.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="uppercase text-xs tracking-wider text-white/50">
                              {details.position}
                            </span>
                            {completedCategories.includes(category) && categoryData[category]?.price && (
                              <span className="text-sm font-semibold text-green-400">
                                ${categoryData[category].price}/mo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {completedCategories.length > 0 && (
                    <div className="flex justify-center">
                      <button 
                        type="submit"
                        className="group relative h-16 px-8 bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center justify-center">
                          <Check className="w-5 h-5 mr-2" />
                          <span className="uppercase tracking-wider">Create {completedCategories.length} Ad Spaces</span>
                        </span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

            </div>
            {renderCategoryModal()}
            {activeInfoModal && (
              <CategoryInfoModal 
                isOpen={!!activeInfoModal}
                onClose={() => setActiveInfoModal(null)}
                category={activeInfoModal}
              />
            )}
          </div>
    </>
  );
};

export default CategoryCreation;