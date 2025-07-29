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
  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/createWebsite',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 201) {
        navigate(`/business-categories/${response.data._id}`, {
          state: {
            websiteDetails: {
              id: response.data._id,
              name: formState.websiteName,
              url: formState.websiteUrl,
              imageUrl: response.data.imageUrl
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Back</span>
          </button>
          <div className="bg-gray-100 px-3 py-1 rounded text-sm">Website Creation</div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-6 py-8">       
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Create New Website</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Website Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Name
              </label>
              <input
                type="text"
                name="websiteName"
                placeholder="Enter your website name"
                value={formState.websiteName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Website URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="text"
                name="websiteUrl"
                placeholder="https://yourwebsite.com"
                value={formState.websiteUrl}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Logo Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Upload
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
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
                <Cloud className="text-gray-400 mb-3" size={32} />
                <p className="text-gray-600 font-medium">Drag and drop or click to upload logo</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
            
            {/* Error Message */}
            {uiState.error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                <AlertTriangle className="w-5 h-5" />
                <span>{uiState.error}</span>
              </div>
            )}
            
            {/* Image Preview */}
            {uiState.filePreview && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Logo Preview</span>
                  <Image className="text-gray-400" size={16} />
                </div>
                <img 
                  src={uiState.filePreview} 
                  alt="Logo Preview" 
                  className="max-h-32 mx-auto object-contain" 
                />
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={uiState.isSubmitting}
              className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uiState.isSubmitting ? 'Creating...' : 'Create Website'}
            </button>
            
            {/* Warning message */}
            {!formState.imageUrl && !uiState.error && (
              <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Please upload a logo to continue</span>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default WebsiteCreation;