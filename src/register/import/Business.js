import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Link, FileText } from 'lucide-react';
import Header from '../../components/backToPreviousHeader';

function ImprovedBusinessForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessLink: '',
    businessLocation: '',
    adDescription: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(businessData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    if (businessData.businessLink && 
        !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(businessData.businessLink)) {
      newErrors.businessLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      Object.values(businessData).every((value) => value.trim()) &&
      (!businessData.businessLink || 
       /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(businessData.businessLink))
    );
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        setLoading(true);
        navigate('/websites', {
          state: {
            file,
            userId,
            ...businessData
          },
        });
      } catch (error) {
        setError('An error occurred during upload');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="ad-waitlist min-h-screen">
      <Header />
      <div className="max-w-7xl py-5 mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 bg-blue-950 p-12 text-white flex items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-4xl font-bold mb-4">Tell Us About Your Business</h2>
              <p className="text-white/80 mb-8">Share the details that will help create a compelling ad</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
                  <Building2 size={24} />
                  <span className="font-medium">Showcase Your Brand</span>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
                  <MapPin size={24} />
                  <span className="font-medium">Specify Your Location</span>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
                  <Link size={24} />
                  <span className="font-medium">Connect Your Website</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 p-12">
            <form onSubmit={handleNext} className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-blue-950 mb-2">Business Details</h1>
                <p className="text-gray-600">Complete your business profile</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                    <Building2 size={20} />
                    Business Name
                  </label>
                  <input 
                    type="text"
                    id="businessName"
                    name="businessName"
                    placeholder="Enter your business name"
                    value={businessData.businessName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all
                      ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessLink" className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                    <Link size={20} />
                    Business Website
                  </label>
                  <input 
                    type="text"
                    id="businessLink"
                    name="businessLink"
                    placeholder="Optional: https://www.yourbusiness.com"
                    value={businessData.businessLink}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all
                      ${errors.businessLink ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.businessLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessLink}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="businessLocation" className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                    <MapPin size={20} />
                    Business Location
                  </label>
                  <input 
                    type="text"
                    id="businessLocation"
                    name="businessLocation"
                    placeholder="City, State, or Country"
                    value={businessData.businessLocation}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all
                      ${errors.businessLocation ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.businessLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessLocation}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="adDescription" className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                    <FileText size={20} />
                    Business Description
                  </label>
                  <textarea 
                    id="adDescription"
                    name="adDescription"
                    placeholder="Tell us about your business in a few compelling words"
                    value={businessData.adDescription}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all min-h-[120px]
                      ${errors.adDescription ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.adDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.adDescription}</p>
                  )}
                </div>
              </div>

              <motion.button 
                type="submit" 
                disabled={!isFormValid() || loading}
                className="w-full mt-6 bg-[#FF4500] text-white px-3 py-2 rounded-lg text-sm font-bold sm:text-base
                          transition-all duration-300 hover:bg-orange-500 hover:-translate-y-0.5
                          disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Processing...' : 'Next'}
              </motion.button>

              {error && (
                <div className="mt-4 mb-4 flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg">
                  <FileText className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImprovedBusinessForm;