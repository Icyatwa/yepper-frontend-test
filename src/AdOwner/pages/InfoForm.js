// InfoForm.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Link, FileText, ArrowLeft, Sparkles, Tag } from 'lucide-react';

function BusinessForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessLink: '',
    businessLocation: '',
    adDescription: '',
    businessCategory: '' // Added business category
  });

  const [errors, setErrors] = useState({});

  // Business categories matching the website schema
  const businessCategories = [
    { value: 'technology', label: 'Technology' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health-wellness', label: 'Health & Wellness' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'education', label: 'Education' },
    { value: 'business-services', label: 'Business Services' },
    { value: 'travel-tourism', label: 'Travel & Tourism' },
    { value: 'arts-culture', label: 'Arts & Culture' },
    { value: 'photography', label: 'Photography' },
    { value: 'gifts-events', label: 'Gifts & Events' },
    { value: 'government-public', label: 'Government & Public' },
    { value: 'general-retail', label: 'General Retail' }
  ];

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
        navigate('/select-websites', {
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
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">BUSINESS DETAILS</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleNext} className="backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                    <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                      <Building2 className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="uppercase text-xs font-semibold text-blue-400 tracking-widest mb-1">Essential</div>
                    <h2 className="text-3xl font-bold">Business Details</h2>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    placeholder="Enter your business name"
                    value={businessData.businessName}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className={`w-full pl-10 py-4 bg-white/5 border ${errors.businessName ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all`}
                  />
                </div>
                {errors.businessName && (
                  <p className="text-red-400 text-sm mt-2">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Business Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link size={16} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    id="businessLink"
                    name="businessLink"
                    placeholder="https://www.yourbusiness.com"
                    value={businessData.businessLink}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className={`w-full pl-10 py-4 bg-white/5 border ${errors.businessLink ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all`}
                  />
                </div>
                {errors.businessLink && (
                  <p className="text-red-400 text-sm mt-2">{errors.businessLink}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Business Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-white/40" />
                  </div>
                  <select
                    id="businessCategory"
                    name="businessCategory"
                    value={businessData.businessCategory}
                    onChange={handleInputChange}
                    className={`w-full pl-10 py-4 bg-white/5 border ${errors.businessCategory ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none`}
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" className="bg-gray-900 text-white/60">Select your business category</option>
                    {businessCategories.map(category => (
                      <option key={category.value} value={category.value} className="bg-gray-900 text-white">
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.businessCategory && (
                  <p className="text-red-400 text-sm mt-2">{errors.businessCategory}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Business Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    id="businessLocation"
                    name="businessLocation"
                    placeholder="City, State, or Country"
                    value={businessData.businessLocation}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className={`w-full pl-10 py-4 bg-white/5 border ${errors.businessLocation ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all`}
                  />
                </div>
                {errors.businessLocation && (
                  <p className="text-red-400 text-sm mt-2">{errors.businessLocation}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Business Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FileText size={16} className="text-white/40" />
                  </div>
                  <textarea
                    id="adDescription"
                    name="adDescription"
                    placeholder="Tell us about your business in a few compelling words..."
                    value={businessData.adDescription}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full pl-10 py-4 bg-white/5 border ${errors.adDescription ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all resize-none`}
                  ></textarea>
                </div>
                {errors.adDescription && (
                  <p className="text-red-400 text-sm mt-2">{errors.adDescription}</p>
                )}
              </div>
            </div>

            <div className="mt-12">
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-white/80">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-blue-400" />
                  </div>
                  <span>Showcase Your Brand</span>
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-blue-400" />
                  </div>
                  <span>Choose Your Category</span>
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Sparkles size={14} className="text-blue-400" />
                  </div>
                  <span>Connect Your Website</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className="w-full group relative h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center uppercase tracking-wider">
                  {loading ? 'Processing...' : 'Continue to Next Step'}
                </span>
              </button>

              {error && (
                <div className="mt-6 flex items-center gap-2 bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-xl">
                  <FileText className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default BusinessForm;