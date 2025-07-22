import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Check, ArrowLeft, Building2, Code, Utensils, Home, Car, Heart, Gamepad2, Shirt, BookOpen, Briefcase, Plane, Music, Camera, Gift, Shield, Zap } from 'lucide-react';
import axios from 'axios';

function BusinessCategorySelection() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const websiteDetails = location.state?.websiteDetails || {};

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    'any': Zap,
    'technology': Code,
    'food-beverage': Utensils,
    'real-estate': Home,
    'automotive': Car,
    'health-wellness': Heart,
    'entertainment': Gamepad2,
    'fashion': Shirt,
    'education': BookOpen,
    'business-services': Briefcase,
    'travel-tourism': Plane,
    'arts-culture': Music,
    'photography': Camera,
    'gifts-events': Gift,
    'government-public': Shield,
    'general-retail': Building2
  };

  const [businessCategories, setBusinessCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (websiteId) {
      fetchExistingCategories();
    }
  }, [websiteId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/business-categories/categories');
      if (response.data.success) {
        const categoriesWithIcons = response.data.data.categories.map(category => ({
          ...category,
          icon: iconMap[category.id] || Building2
        }));
        setBusinessCategories(categoriesWithIcons);
      }
    } catch (error) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/business-categories/website/${websiteId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setSelectedCategories(response.data.data.businessCategories || []);
      }
    } catch (error) {
      console.log('No existing categories found or error fetching');
    }
  };

  const handleCategoryToggle = (categoryId) => {
    if (categoryId === 'any') {
      if (selectedCategories.includes('any')) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(['any']);
      }
    } else {
      let newSelection = selectedCategories.filter(id => id !== 'any');
      
      if (newSelection.includes(categoryId)) {
        newSelection = newSelection.filter(id => id !== categoryId);
      } else {
        newSelection = [...newSelection, categoryId];
      }
      
      setSelectedCategories(newSelection);
    }
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one business category');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/business-categories/website/${websiteId}`,
        { businessCategories: selectedCategories },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Navigate to create categories page
        navigate(`/create-categories/${websiteId}`, {
          state: {
            websiteDetails: {
              ...websiteDetails,
              businessCategories: selectedCategories
            }
          }
        });
      }
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update business categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Choose Business Categories
            </h1>
            <p className="text-gray-600 mb-4">
              Select the types of businesses you want to advertise on your website: <strong>{websiteDetails.name || 'Your Website'}</strong>
            </p>
            <div className="text-sm text-gray-500">
              You can choose specific categories or select "Any Category" to accept all types of advertisements.
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              const isAnySelected = selectedCategories.includes('any');
              const isDisabled = isAnySelected && category.id !== 'any';

              return (
                <div
                  key={category.id}
                  onClick={() => !isDisabled && handleCategoryToggle(category.id)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : isDisabled 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    ${category.id === 'any' ? 'ring-2 ring-orange-200' : ''}
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected 
                        ? 'bg-blue-500 text-white' 
                        : category.id === 'any'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        font-medium text-sm
                        ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                      `}>
                        {category.name}
                      </h3>
                      <p className={`
                        text-xs mt-1 line-clamp-2
                        ${isSelected ? 'text-blue-700' : 'text-gray-500'}
                      `}>
                        {category.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selection Summary */}
          {selectedCategories.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Selected Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((categoryId) => {
                  const category = businessCategories.find(c => c.id === categoryId);
                  return (
                    <span
                      key={categoryId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedCategories.length === 0 
                ? 'No categories selected'
                : `${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'} selected`
              }
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={selectedCategories.length === 0 || isSubmitting}
              className={`
                flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${selectedCategories.length > 0 && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCategorySelection;