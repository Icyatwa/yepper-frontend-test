import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { CloudUpload, FileText, Image, ChevronLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from '../../components/backToPreviousHeader';

function WebsiteCreation() {
  const navigate = useNavigate();
  const { user } = useClerk();
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

  const handleBack = () => {
    navigate(-1);
  };

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
      formData.append('ownerId', user?.id);
      formData.append('websiteName', formState.websiteName);
      formData.append('websiteLink', formState.websiteUrl);
      if (formState.imageUrl) {
        formData.append('file', formState.imageUrl);
      }

      const response = await axios.post(
        'http://localhost:5000/api/websites',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
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
    <div className="ad-waitlist min-h-screen">
      <Header />

      <div className="flex justify-center items-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-extrabold mb-3 text-blue-950">Create Your Website</h2>
          <p className="text-sm text-gray-600 mb-6">
            Fill in your website details and upload a logo
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                name="websiteName"
                placeholder="Website Name"
                value={formState.websiteName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-all duration-300"
              />

              <input
                // type="url"
                name="websiteUrl"
                placeholder="Website URL"
                value={formState.websiteUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-all duration-300"
              />

              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer
                          transition-all duration-300 hover:bg-gray-50 hover:border-[#FF4500]
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
                <CloudUpload className="w-12 h-12 text-[#FF4500] mb-4" />
                <p className="text-gray-600">Drag and drop or click to upload logo</p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: JPEG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>

            {uiState.error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>{uiState.error}</span>
              </div>
            )}

            {uiState.filePreview && (
              <div className="mt-6 relative">
                <div className="absolute top-3 right-3 z-10">
                  <Image className="w-8 h-8 p-2 bg-white rounded-full text-[#FF4500] shadow-md" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img 
                    src={uiState.filePreview} 
                    alt="Logo Preview" 
                    className="w-full max-h-[200px] object-contain" 
                  />
                </div>
              </div>
            )}

            <motion.button 
              type="submit"
              disabled={uiState.isSubmitting}
              className="w-full bg-[#FF4500] text-white px-3 py-2 rounded-lg text-sm font-bold sm:text-base
                        transition-all duration-300 hover:bg-orange-500 hover:-translate-y-0.5
                        disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {uiState.isSubmitting ? 'Creating...' : 'Create Website'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WebsiteCreation;