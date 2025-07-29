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
  ArrowLeft
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';

const Categories = () => {
  const [user, setUser] = useState(null);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const adOwnerEmail = user?.email;

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const promises = selectedWebsites.map(async (websiteId) => {
          const websiteResponse = await fetch(`http://localhost:5000/api/createWebsite/website/${websiteId}`);
          const websiteData = await websiteResponse.json();
          
          const categoriesResponse = await fetch(
            `http://localhost:5000/api/ad-categories/${websiteId}/advertiser`,
            {
              headers: getAuthHeaders()
            }
          );
          
          if (!categoriesResponse.ok) {
            if (categoriesResponse.status === 401) {
              console.error('Authentication required. Please log in.');
              navigate('/login');
              return;
            }
            throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
          }
          
          const categoriesData = await categoriesResponse.json();

          return {
            websiteName: websiteData.websiteName || 'Unknown Website',
            websiteLink: websiteData.websiteLink || '#',
            categories: categoriesData.categories || [],
          };
        });
        
        const result = await Promise.all(promises);
        setCategoriesByWebsite(result.filter(Boolean));
        
      } catch (error) {
        console.error('Failed to fetch categories or websites:', error);
        setError('Failed to load categories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      navigate('/login');
      return;
    }

    if (selectedWebsites) fetchCategories();
  }, [selectedWebsites, navigate]);

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
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('adOwnerEmail', user?.email);
      if (file) formData.append('file', file);
      formData.append('businessName', businessName);
      formData.append('businessLink', businessLink);
      formData.append('businessLocation', businessLocation);
      formData.append('adDescription', adDescription);
      formData.append('selectedWebsites', JSON.stringify(selectedWebsites));
      formData.append('selectedCategories', JSON.stringify(selectedCategories));

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };

      const response = await axios.post('http://localhost:5000/api/web-advertise', formData, config);

      if (response.data.success) {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Error during ad upload:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      const errorMessage = error.response?.data?.message || 'An error occurred while uploading the ad';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (!user && getAuthToken()) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <header style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
        <span>Select Categories</span>
      </header>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {error && (
          <div style={{ 
            border: '1px solid red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            marginBottom: '20px' 
          }}>
            <Info size={20} />
            {typeof error === 'string' ? error : 'Please select at least one category to proceed'}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <LoadingSpinner />
          </div>
        ) : categoriesByWebsite.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
            gap: '30px' 
          }}>
            {categoriesByWebsite.map((website) => (
              <div key={website.websiteName} style={{ border: '1px solid #ddd', padding: '0' }}>
                <div style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid #ddd', 
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{website.websiteName}</h2>
                  <a 
                    href={website.websiteLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'none' }}
                  >
                    <LinkIcon size={20} />
                  </a>
                </div>
                
                {website.categories.length > 0 ? (
                  <div style={{ padding: '20px' }}>
                    {website.categories.map((category) => (
                      <div
                        key={category._id}
                        onClick={() => 
                          !category.isFullyBooked && handleCategorySelection(category._id)
                        }
                        style={{
                          border: selectedCategories.includes(category._id) ? '2px solid #007bff' : '1px solid #ddd',
                          padding: '15px',
                          marginBottom: '15px',
                          cursor: category.isFullyBooked ? 'not-allowed' : 'pointer',
                          opacity: category.isFullyBooked ? 0.5 : 1,
                          backgroundColor: selectedCategories.includes(category._id) ? '#e6f3ff' : 'white',
                          position: 'relative'
                        }}
                      >
                        {category.isFullyBooked && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            right: '10px', 
                            backgroundColor: 'red', 
                            color: 'white', 
                            padding: '4px 8px', 
                            fontSize: '12px' 
                          }}>
                            Fully Booked
                          </div>
                        )}
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: '10px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Tag size={20} color="#007bff" />
                            <h3 style={{ margin: 0, fontSize: '16px' }}>
                              {category.categoryName}
                            </h3>
                          </div>
                          {selectedCategories.includes(category._id) && (
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              backgroundColor: '#007bff', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check size={16} color="white" />
                            </div>
                          )}
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                            {category.description.length > 100 
                              ? `${category.description.substring(0, 100)}...`
                              : category.description
                            }
                          </p>
                          {category.description.length > 100 && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDescription(category.description);
                              }}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#007bff', 
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginTop: '5px'
                              }}
                            >
                              <Info size={16} /> Read more
                            </button>
                          )}
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          paddingTop: '15px',
                          borderTop: '1px solid #eee'
                        }}>
                          <DollarSign size={20} color="#28a745" />
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{category.price}</span>
                          {category.isFullyBooked && (
                            <span style={{ fontSize: '14px', color: 'red' }}>(Space Full)</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    <p style={{ fontWeight: 'bold' }}>No spaces available</p>
                    <p style={{ fontSize: '14px', margin: '10px 0 0 0' }}>Check back later for updates</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '20px', color: '#666' }}>No spaces available</p>
            <p style={{ color: '#999', marginTop: '10px' }}>Please select different websites and try again</p>
          </div>
        )}
        
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button 
            onClick={handleNext}
            disabled={selectedCategories.length === 0 || isSubmitting}
            style={{
              padding: '15px 30px',
              border: '1px solid #007bff',
              backgroundColor: (selectedCategories.length === 0 || isSubmitting) ? '#ccc' : '#007bff',
              color: 'white',
              cursor: (selectedCategories.length === 0 || isSubmitting) ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>

        {/* Modal for full description */}
        {selectedDescription && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedDescription(null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
              <h3 style={{ marginTop: 0 }}>Full Description</h3>
              <p style={{ lineHeight: '1.6' }}>{selectedDescription}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Categories;