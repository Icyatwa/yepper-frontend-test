import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Link, FileText, ArrowLeft, Tag } from 'lucide-react';

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
    businessCategory: ''
  });

  const [errors, setErrors] = useState({});

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
    <div>
      <header style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
        <span>Business Details</span>
      </header>

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>
            <Building2 size={24} style={{ display: 'inline', marginRight: '10px' }} />
            Business Details
          </h2>

          <form onSubmit={handleNext}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Business Name
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ 
                    position: 'absolute', 
                    left: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter your business name"
                    value={businessData.businessName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: errors.businessName ? '1px solid red' : '1px solid #ccc',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                {errors.businessName && (
                  <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Business Website
                </label>
                <div style={{ position: 'relative' }}>
                  <Link size={16} style={{ 
                    position: 'absolute', 
                    left: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} />
                  <input
                    type="text"
                    name="businessLink"
                    placeholder="https://www.yourbusiness.com"
                    value={businessData.businessLink}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: errors.businessLink ? '1px solid red' : '1px solid #ccc',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                {errors.businessLink && (
                  <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
                    {errors.businessLink}
                  </p>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Business Category
                </label>
                <div style={{ position: 'relative' }}>
                  <Tag size={16} style={{ 
                    position: 'absolute', 
                    left: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} />
                  <select
                    name="businessCategory"
                    value={businessData.businessCategory}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: errors.businessCategory ? '1px solid red' : '1px solid #ccc',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select your business category</option>
                    {businessCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.businessCategory && (
                  <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
                    {errors.businessCategory}
                  </p>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Business Location
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ 
                    position: 'absolute', 
                    left: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} />
                  <input
                    type="text"
                    name="businessLocation"
                    placeholder="City, State, or Country"
                    value={businessData.businessLocation}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: errors.businessLocation ? '1px solid red' : '1px solid #ccc',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                {errors.businessLocation && (
                  <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
                    {errors.businessLocation}
                  </p>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Business Description
                </label>
                <div style={{ position: 'relative' }}>
                  <FileText size={16} style={{ 
                    position: 'absolute', 
                    left: '10px', 
                    top: '15px',
                    color: '#999'
                  }} />
                  <textarea
                    name="adDescription"
                    placeholder="Tell us about your business in a few compelling words..."
                    value={businessData.adDescription}
                    onChange={handleInputChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: errors.adDescription ? '1px solid red' : '1px solid #ccc',
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                {errors.adDescription && (
                  <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
                    {errors.adDescription}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '30px' }}>
              <p style={{ marginBottom: '20px' }}>
                • Showcase Your Brand<br/>
                • Choose Your Category<br/>
                • Connect Your Website
              </p>

              <button
                type="submit"
                disabled={!isFormValid() || loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '1px solid #007bff',
                  backgroundColor: '#007bff',
                  color: 'white',
                  cursor: (!isFormValid() || loading) ? 'not-allowed' : 'pointer',
                  opacity: (!isFormValid() || loading) ? 0.5 : 1
                }}
              >
                {loading ? 'Processing...' : 'Continue to Next Step'}
              </button>

              {error && (
                <div style={{ 
                  marginTop: '20px',
                  border: '1px solid red', 
                  backgroundColor: '#ffe6e6', 
                  padding: '10px'
                }}>
                  <FileText size={20} />
                  {error}
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