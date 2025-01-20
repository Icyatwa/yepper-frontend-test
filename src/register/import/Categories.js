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
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/backToPreviousHeader';
import Loading from '../../components/LoadingSpinner';
import axios from 'axios';

const LoadingSpinner = () => (
  <Loading />
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-full max-w-md mx-4 my-6 z-50" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex flex-col w-full bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative p-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Categories = () => {
  const { user } = useUser();
  
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
  
  const adOwnerEmail = user.primaryEmailAddress.emailAddress;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const promises = selectedWebsites.map(async (websiteId) => {
          const websiteResponse = await fetch(`http://localhost:5000/api/websites/website/${websiteId}`);
          const websiteData = await websiteResponse.json();
          const categoriesResponse = await fetch(`http://localhost:5000/api/ad-categories/${websiteId}`);
          const categoriesData = await categoriesResponse.json();

          return {
            websiteName: websiteData.websiteName || 'Unknown Website',
            websiteLink: websiteData.websiteLink || '#',
            categories: categoriesData.categories || [],
          };
        });
        const result = await Promise.all(promises);
        setCategoriesByWebsite(result);
      } catch (error) {
        console.error('Failed to fetch categories or websites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedWebsites) fetchCategories();
  }, [selectedWebsites]);

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
    
    try {
      const formData = new FormData();
      formData.append('adOwnerEmail', adOwnerEmail);
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('businessName', businessName);
      formData.append('businessLink', businessLink);
      formData.append('businessLocation', businessLocation);
      formData.append('adDescription', adDescription);
      formData.append('selectedWebsites', JSON.stringify(selectedWebsites));
      formData.append('selectedCategories', JSON.stringify(selectedCategories));
      // formData.append('selectedSpaces', JSON.stringify(selectedSpaces));

      await axios.post('http://localhost:5000/api/importAds', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during ad upload:', error);
      setError('An error occurred while uploading the ad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ad-waitlist min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full mt-6 space-y-2">
              <h1 className="text-4xl text-blue-950 mb-2 font-bold">
                Select Categories
              </h1>
              <p className="text-gray-600">
                Choose relevant categories for your advertisement
              </p>
            </div>
            <button 
              onClick={handleNext}
              className={`w-full mt-6 flex items-center justify-center px-3 py-2 rounded-lg font-bold text-white sm:text-base transition-all duration-300 ${
                selectedCategories.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5'
              }`}
            >
              Next
            </button>
          </div>

          {error && (
            <div className="mx-8 mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
              <Info className="w-5 h-5" />
              <span>Please select at least one category to proceed</span>
            </div>
          )}

          <div className="p-8 pt-0">
            {isLoading ? (
              <LoadingSpinner />
            ) : categoriesByWebsite.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoriesByWebsite.map((website) => (
                  <div 
                    key={website.websiteName} 
                    className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-blue-950">{website.websiteName}</h2>
                      <a 
                        href={website.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-[#FF4500] hover:text-orange-500 hover:bg-red-50/50 rounded-lg transition-colors"
                      >
                        <LinkIcon className="w-5 h-5" />
                      </a>
                    </div>
                    
                    {website.categories.length > 0 ? (
                      <div className="p-4 grid gap-4">
                        {website.categories.map((category) => (
                          <div
                            key={category._id}
                            onClick={() => handleCategorySelection(category._id)}
                            className={`group relative flex flex-col bg-white rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                              selectedCategories.includes(category._id)
                                ? 'border-[#FF4500] bg-red-50/50 shadow-lg scale-[1.02]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <Tag className="w-5 h-5 text-[#FF4500]" />
                                <h3 className="font-semibold text-blue-950">
                                  {category.categoryName}
                                </h3>
                              </div>
                              {selectedCategories.includes(category._id) && (
                                <Check size={24} className="text-[#FF4500]" />
                              )}
                            </div>
                            
                            <div className="flex items-start gap-2 mb-3">
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {category.description}
                              </p>
                              {category.description.length > 100 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDescription(category.description);
                                  }}
                                  className="flex-shrink-0 p-1 text-[#FF4500] hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center text-gray-900">
                              <DollarSign className="w-5 h-5 text-orange-500 mr-1" />
                              <span className="font-semibold text-blue-950">{category.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No categories available for this website
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No categories available for the selected websites
              </div>
            )}
          </div>
        </div>

        <Modal 
          isOpen={!!selectedDescription} 
          onClose={() => setSelectedDescription(null)}
          title="Category Description"
        >
          <p className="text-gray-700 leading-relaxed">{selectedDescription}</p>
        </Modal>
      </div>
    </div>
  );
};

export default Categories;