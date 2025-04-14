// DirectAdvertise.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

function DirectAdvertise() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get the pre-selected website and category IDs
  const websiteId = queryParams.get('websiteId');
  const categoryId = queryParams.get('categoryId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessLink: '',
    businessLocation: '',
    adDescription: ''
  });

  // Fetch website and category info
  useEffect(() => {
    const fetchData = async () => {
      if (!websiteId || !categoryId) {
        setError('Missing website or category information.');
        setIsLoading(false);
        return;
      }

      try {
        // Get website info
        const websiteResponse = await fetch(`http://localhost:5000/api/websites/website/${websiteId}`);
        if (!websiteResponse.ok) {
          throw new Error('Website not found');
        }
        const websiteData = await websiteResponse.json();
        setWebsiteInfo(websiteData);
        
        // Get category info
        const categoryResponse = await fetch(`http://localhost:5000/api/ad-categories/category/${categoryId}`);
        if (!categoryResponse.ok) {
          throw new Error('Category not found');
        }
        const categoryData = await categoryResponse.json();
        setCategoryInfo(categoryData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load website or category information');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [websiteId, categoryId]);

  // File handling functions
  const processFile = (selectedFile) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'application/pdf'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!selectedFile) {
      return;
    }
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload an image, video, or PDF.');
      return;
    }
    
    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum size is 50MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview({
        url: reader.result,
        type: selectedFile.type
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    processFile(selectedFile);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // if (!file) {
    //   setError('Please upload a file for your advertisement');
    //   return false;
    // }
    
    if (!businessData.businessName) {
      setError('Business name is required');
      return false;
    }
    
    if (!businessData.businessLink) {
      setError('Business link is required');
      return false;
    }
    
    if (!businessData.businessLocation) {
      setError('Business location is required');
      return false;
    }
    
    if (!businessData.adDescription) {
      setError('Advertisement description is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('adOwnerEmail', user.primaryEmailAddress.emailAddress);
      formData.append('file', file);
      formData.append('userId', user.id);
      formData.append('businessName', businessData.businessName);
      formData.append('businessLink', businessData.businessLink);
      formData.append('businessLocation', businessData.businessLocation);
      formData.append('adDescription', businessData.adDescription);
      formData.append('selectedWebsites', JSON.stringify([websiteId]));
      formData.append('selectedCategories', JSON.stringify([categoryId]));

      await axios.post('http://localhost:5000/api/importAds', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard', { 
        state: { 
          success: true, 
          message: 'Advertisement submitted successfully!' 
        } 
      });
    } catch (error) {
      console.error('Error during ad upload:', error);
      setError('An error occurred while uploading the ad');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !websiteInfo && !categoryInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
          <p className="mt-2">
            <button 
              onClick={() => navigate('/websites')}
              className="text-blue-500 hover:underline"
            >
              Go to website selection
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Your Advertisement</h1>
        
        {/* Selected website and category info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">Selected Placement</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="text-gray-600 mb-1">Website</p>
              <p className="font-medium">{websiteInfo?.websiteName}</p>
              <a href={websiteInfo?.websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">
                {websiteInfo?.websiteLink}
              </a>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-1">Ad Space</p>
              <p className="font-medium">{categoryInfo?.categoryName}</p>
              <p className="text-sm text-gray-500">{categoryInfo?.spaceType} - ${categoryInfo?.price}</p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* File upload section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Advertisement Content</h2>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {filePreview ? (
                <div className="flex flex-col items-center">
                  {filePreview.type.startsWith('image/') ? (
                    <img src={filePreview.url} alt="Preview" className="max-h-48 mb-4 rounded" />
                  ) : filePreview.type.startsWith('video/') ? (
                    <video src={filePreview.url} controls className="max-h-48 mb-4 rounded"></video>
                  ) : (
                    <div className="bg-gray-100 p-4 mb-4 rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{file.name}</p>
                  <button 
                    type="button" 
                    className="mt-3 text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview(null);
                    }}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Drag and drop your file here or click to browse</p>
                  <p className="mt-1 text-xs text-gray-500">Supports images, videos, and PDFs (Max 50MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,application/pdf"
              />
            </div>
          </div>
          
          {/* Business information section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={businessData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="businessLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Website/Link *
                </label>
                <input
                  type="url"
                  id="businessLink"
                  name="businessLink"
                  value={businessData.businessLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="businessLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Location *
                </label>
                <input
                  type="text"
                  id="businessLocation"
                  name="businessLocation"
                  value={businessData.businessLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="adDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Advertisement Description *
                </label>
                <textarea
                  id="adDescription"
                  name="adDescription"
                  value={businessData.adDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Ad space details */}
          {categoryInfo?.instructions && (
            <div className="mb-8 bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-md font-semibold mb-2 text-blue-800">Placement Instructions</h3>
              <p className="text-sm text-blue-700">{categoryInfo.instructions}</p>
            </div>
          )}
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit Advertisement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DirectAdvertise;