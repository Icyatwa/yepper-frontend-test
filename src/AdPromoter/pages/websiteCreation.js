// websiteCreation.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Image, AlertTriangle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

function WebsiteCreation() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    websiteName: '',
    websiteUrl: '',
    imageUrl: null
  });

  const [uiState, setUiState] = useState({
    filePreview: null,
    error: null,
    isSubmitting: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setUiState(prev => ({
        ...prev,
        error: 'Only JPEG, PNG, and GIF images are allowed.'
      }));
      return false;
    }

    if (file.size > maxSize) {
      setUiState(prev => ({
        ...prev,
        error: 'Image must be smaller than 5MB.'
      }));
      return false;
    }

    return true;
  };

  const processFile = (file) => {
    if (!file) return;

    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState(prev => ({
        ...prev,
        imageUrl: file
      }));
      setUiState(prev => ({
        ...prev,
        filePreview: reader.result,
        error: null
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    processFile(selectedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const formData = new FormData();
      formData.append('websiteName', formState.websiteName);
      formData.append('websiteLink', formState.websiteUrl);
      if (formState.imageUrl) {
        formData.append('file', formState.imageUrl);
      }

      // CHANGE: Added authorization header with JWT token
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/createWebsite',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // CHANGE: Added auth header
          }
        }
      );

      if (response.status === 201) {
        navigate(`/create-categories/${response.data._id}`, {
          state: {
            websiteDetails: {
              id: response.data._id,
              name: formState.websiteName,
              url: formState.websiteUrl
            }
          }
        });
      }
      
    } catch (error) {
      setUiState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Failed to create website'
      }));
    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ultra-modern header with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium tracking-wide">BACK</span>
          </button>
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">WEBSITE</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">       
        <div className="max-w-2xl mx-auto backdrop-blur-md bg-gradient-to-b from-blue-900/20 to-blue-900/5 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500">
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Website Name Input */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">Website Name</label>
                  <input
                    type="text"
                    name="websiteName"
                    placeholder="Enter your website name"
                    value={formState.websiteName}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>
                
                {/* Website URL Input */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">Website URL</label>
                  <input
                    type="text"
                    name="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    value={formState.websiteUrl}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>
                
                {/* Logo Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">Logo Upload</label>
                  <div 
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer
                              transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5
                              flex flex-col items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                      <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                        <Cloud className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="text-white/80 font-medium">Drag and drop or click to upload logo</p>
                    <p className="text-sm text-white/50 mt-2">
                      Supported formats: JPEG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {uiState.error && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{uiState.error}</span>
                </div>
              )}
              
              {/* Image Preview */}
              {uiState.filePreview && (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                      <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                        <Image className="text-white" size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-white/5 to-white/10 p-6">
                    <img 
                      src={uiState.filePreview} 
                      alt="Logo Preview" 
                      className="max-h-[180px] mx-auto object-contain" 
                    />
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                // disabled={isSubmitDisabled}
                className={`w-full group relative h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300 
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 
                   transition-opacity duration-300`}
                ></div>
                <span className="relative z-10 flex items-center justify-center uppercase tracking-wider">
                  {uiState.isSubmitting ? 'Creating...' : 'Create Website'}
                </span>
              </button>
              
              {/* Add message when image is required */}
              {!formState.imageUrl && !uiState.error && (
                <div className="flex items-center justify-center gap-2 text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Please upload a logo to continue</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WebsiteCreation;