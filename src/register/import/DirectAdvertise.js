// DirectAdvertise.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { FileUp, Globe, Building2, Link, MapPin, FileText } from 'lucide-react';

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
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 relative"></div>
        </div>
      </div>
    );
  }

  if (error && !websiteInfo && !categoryInfo) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto backdrop-blur-md bg-gradient-to-b from-red-900/30 to-red-900/10 rounded-3xl overflow-hidden border border-white/10 p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Error</h1>
            <p className="text-white/80 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/websites')}
              className="group relative h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center uppercase tracking-wider">
                Go to website selection
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-12 bg-blue-500 mr-6"></div>
          <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Create Advertisement</span>
          <div className="h-px w-12 bg-blue-500 ml-6"></div>
        </div>
        
        <h1 className="text-center text-5xl font-bold mb-12 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Craft Your Perfect Ad
          </span>
        </h1>

        {error && (
          <div className="max-w-4xl mx-auto backdrop-blur-md bg-gradient-to-b from-red-900/30 to-red-900/10 rounded-3xl overflow-hidden border border-white/10 p-6 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          {/* Selected website and category info */}
          <div className="backdrop-blur-md bg-gradient-to-b from-purple-900/30 to-purple-900/10 rounded-3xl overflow-hidden border border-white/10 p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Selected Placement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                    <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                      <Globe className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Website</h3>
                  </div>
                </div>
                <p className="text-xl font-medium text-white mb-2">{websiteInfo?.websiteName}</p>
                <a href={websiteInfo?.websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                  {websiteInfo?.websiteLink}
                </a>
              </div>
              
              <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500 blur-md opacity-40"></div>
                    <div className="relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400">
                      <FileText className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Ad Space</h3>
                  </div>
                </div>
                <p className="text-xl font-medium text-white mb-2">{categoryInfo?.categoryName}</p>
                <p className="text-white/70">{categoryInfo?.spaceType} - <span className="text-green-400">${categoryInfo?.price}</span></p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* File upload section */}
            <div className="backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <FileUp className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">Upload Content</h2>
                </div>
              </div>
              
              <div 
                className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {filePreview ? (
                  <div className="flex flex-col items-center">
                    {filePreview.type.startsWith('image/') ? (
                      <img src={filePreview.url} alt="Preview" className="max-h-48 mb-4 rounded-lg shadow-lg" />
                    ) : filePreview.type.startsWith('video/') ? (
                      <video src={filePreview.url} controls className="max-h-48 mb-4 rounded-lg shadow-lg"></video>
                    ) : (
                      <div className="bg-white/10 p-6 mb-4 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    <p className="text-white/80">{file.name}</p>
                    <button 
                      type="button" 
                      className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
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
                    <div className="relative mx-auto h-20 w-20 mb-4">
                      <div className="absolute inset-0 rounded-full bg-blue-500 blur-lg opacity-20"></div>
                      <div className="relative flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-white/80 text-lg mb-2">Drag and drop your file here or click to browse</p>
                    <p className="text-white/50">Supports images, videos, and PDFs (Max 50MB)</p>
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
            <div className="backdrop-blur-md bg-gradient-to-b from-purple-900/30 to-purple-900/10 rounded-3xl overflow-hidden border border-white/10 p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400">
                    <Building2 className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">Business Information</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="flex items-center text-white/80 mb-2">
                    <Building2 size={16} className="mr-2" />
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={businessData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="businessLink" className="flex items-center text-white/80 mb-2">
                    <Link size={16} className="mr-2" />
                    Business Website/Link *
                  </label>
                  <input
                    type="url"
                    id="businessLink"
                    name="businessLink"
                    value={businessData.businessLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="https://"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="businessLocation" className="flex items-center text-white/80 mb-2">
                    <MapPin size={16} className="mr-2" />
                    Business Location *
                  </label>
                  <input
                    type="text"
                    id="businessLocation"
                    name="businessLocation"
                    value={businessData.businessLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="adDescription" className="flex items-center text-white/80 mb-2">
                    <FileText size={16} className="mr-2" />
                    Advertisement Description *
                  </label>
                  <textarea
                    id="adDescription"
                    name="adDescription"
                    value={businessData.adDescription}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Ad space details */}
            {categoryInfo?.instructions && (
              <div className="backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 p-8 mb-12">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                    <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Placement Instructions</h3>
                  </div>
                </div>
                <p className="text-white/80 pl-12">{categoryInfo.instructions}</p>
              </div>
            )}
            
            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative h-16 w-full md:w-1/2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center text-lg">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="uppercase tracking-wider">Submit Advertisement</span>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DirectAdvertise;