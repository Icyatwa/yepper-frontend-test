import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, XCircle, Clock, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Header from '../../components/backToPreviousHeader';
import Loading from '../../components/LoadingSpinner';

const LoadingSpinner = () => (
  <Loading />
);

const Spaces = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId, businessName, businessLink, businessLocation, adDescription, selectedWebsites, selectedCategories } = location.state || {};

  const [categoryDetails, setCategoryDetails] = useState([]);
  const [selectedSpaces, setSelectedSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const adOwnerEmail = user.primaryEmailAddress.emailAddress;

  useEffect(() => {
      const fetchCategoryDetails = async () => {
        setIsFetching(true);
        try {
          const promises = selectedCategories.map(async (categoryId) => {
            const categoryResponse = await fetch(`http://localhost:5000/api/ad-categories/category/${categoryId}`);
            const categoryData = await categoryResponse.json();
  
            const websiteResponse = await fetch(`http://localhost:5000/api/websites/website/${categoryData.websiteId}`);
            const websiteData = await websiteResponse.json();
  
            const spacesResponse = await fetch(`http://localhost:5000/api/ad-spaces/${categoryId}`);
            const spacesData = await spacesResponse.json();
  
            return {
              websiteName: websiteData.websiteName,
              logoUrl: websiteData.logoUrl,
              category: categoryData,
              spaces: spacesData,
            };
          });
  
          const result = await Promise.all(promises);
          setCategoryDetails(result);
        } catch (error) {
          console.error('Failed to fetch spaces or categories:', error);
          setError('Failed to load spaces. Please try again.');
        } finally {
          setIsFetching(false);
        }
      };
  
      if (selectedCategories && selectedCategories.length > 0) {
        fetchCategoryDetails();
      }
    }, [selectedCategories]);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      categoryDetails.forEach(detail => {
        detail.spaces.forEach(space => {
          if (selectedSpaces.includes(space._id)) {
            total += parseFloat(space.price);
          }
        });
      });
      setTotalPrice(total);
    };
    calculateTotal();
  }, [selectedSpaces, categoryDetails]);

  const handleSpaceSelect = (spaceId, remainingCount, price) => {
    if (remainingCount <= 0) return;
    
    setSelectedSpaces((prevSelected) => 
      prevSelected.includes(spaceId)
        ? prevSelected.filter((id) => id !== spaceId)
        : [...prevSelected, spaceId]
    );
  };

  const handlePublish = async () => {
    setLoading(true);
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
      formData.append('selectedSpaces', JSON.stringify(selectedSpaces));

      await axios.post('http://localhost:5000/api/importAds', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during ad upload:', error);
      setError('An error occurred while uploading the ad');
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'Always available':
        return <CheckCircle2 className="w-5 h-5 text-[#FF4500]" />;
      case 'Pick a date':
        return <Calendar className="w-5 h-5 text-[#FF4500]" />;
      default:
        return <Clock className="w-5 h-5 text-[#FF4500]" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-[100px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-950">Select Ad Spaces</h1>
            <p className="text-gray-600 mt-2">Choose the perfect spaces for your advertisement</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Selected</p>
            <p className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {isFetching ? (
          <div className="bg-white rounded-xl shadow-sm">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <button 
              onClick={() => window.location.reload()} 
              className="text-[#FF4500] hover:text-orange-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {categoryDetails.map((detail) => (
              <div key={detail.category._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    {detail.logoUrl && (
                      <img src={detail.logoUrl} alt={detail.websiteName} className="w-12 h-12 object-contain" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-950">{detail.websiteName}</h2>
                      <p className="text-sm text-gray-600">{detail.category.categoryName}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detail.spaces && detail.spaces.length > 0 ? (
                      detail.spaces.map((space) => (
                        <div
                          key={space._id}
                          onClick={() => handleSpaceSelect(space._id, space.remainingUserCount, space.price)}
                          className={`relative rounded-lg border-2 transition-all duration-200 ${
                            selectedSpaces.includes(space._id)
                              ? 'border-[#FF4500] bg-red-50/50 shadow-lg scale-[1.02]'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${space.remainingUserCount <= 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-2">
                                {getAvailabilityIcon(space.availability)}
                                <span className="font-medium text-blue-950">{space.spaceType}</span>
                              </div>
                              <span className="text-lg font-bold text-blue-600">${space.price}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600 flex items-center">
                                {space.availability === 'Always available' ? (
                                  <span className="text-orange-500">Always Available</span>
                                ) : space.availability === 'Pick a date' ? (
                                  <span>
                                    {new Date(space.startDate).toLocaleDateString()} - {new Date(space.endDate).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span className='text-gray-600'>{space.availability}</span>
                                )}
                              </div>

                              <div className={`text-sm flex items-center ${
                                space.remainingUserCount > 0 ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {space.remainingUserCount > 0 ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    {space.remainingUserCount} spaces left
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Fully Booked
                                  </>
                                )}
                              </div>
                            </div>

                            {selectedSpaces.includes(space._id) && (
                              <div className="absolute top-[50%] right-2">
                                <Check size={24} className="text-[#FF4500]" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-8 text-center">
                        <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Spaces Available</h3>
                        <p className="text-gray-500">There are currently no ad spaces available in this category.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Selected Spaces</p>
                <p className="text-2xl font-bold text-blue-950">${totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handlePublish}
                disabled={loading || selectedSpaces.length === 0}
                className="flex items-center px-3 py-2 bg-[#FF4500] text-white sm:text-base rounded-lg font-bold transition-all duration-300 hover:bg-orange-500 hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Publishing...
                  </div>
                ) : (
                  <>
                    Publish Ad
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spaces;