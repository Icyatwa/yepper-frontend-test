import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Check, Search, Filter, ArrowLeft, PlusCircle, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

function Websites() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId, businessName, businessLink, businessLocation, adDescription, businessCategory } = location.state || {};
  const [websites, setWebsites] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/createWebsite');
        const data = await response.json();
        
        const relevantWebsites = data.filter(website => {
          const categories = website.businessCategories;
          if (!categories || !Array.isArray(categories)) {
            return false;
          }

          if (categories.includes('any')) {
            return true;
          }
          
          if (businessCategory && categories.includes(businessCategory)) {
            return true;
          }
          
          return false;
        });
        
        setWebsites(relevantWebsites);
        setFilteredWebsites(relevantWebsites);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch websites:', error);
        setError('Failed to fetch websites. Please try again.');
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [businessCategory]);

  useEffect(() => {
    let result = websites;
    
    if (searchTerm) {
      result = result.filter(site => 
        site.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.websiteLink.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredWebsites(result);
  }, [searchTerm, websites]);

  const handleSelect = (websiteId) => {
    setSelectedWebsites(prev => 
      prev.includes(websiteId) 
        ? prev.filter(id => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const handleNext = () => {
    if (selectedWebsites.length === 0) return;

    navigate('/select-categories', {
      state: {
        file,
        userId,
        businessName,
        businessLink,
        businessLocation,
        adDescription,
        businessCategory,
        selectedWebsites,
      },
    });
  };

  const formatCategoryForDisplay = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return 'No Categories';
    }

    if (categories.includes('any')) {
      return 'All Categories';
    }
    
    const categoryLabels = {
      'technology': 'Technology',
      'food-beverage': 'Food & Beverage',
      'real-estate': 'Real Estate',
      'automotive': 'Automotive',
      'health-wellness': 'Health & Wellness',
      'entertainment': 'Entertainment',
      'fashion': 'Fashion',
      'education': 'Education',
      'business-services': 'Business Services',
      'travel-tourism': 'Travel & Tourism',
      'arts-culture': 'Arts & Culture',
      'photography': 'Photography',
      'gifts-events': 'Gifts & Events',
      'government-public': 'Government & Public',
      'general-retail': 'General Retail'
    };
    
    return categories.map(cat => categoryLabels[cat] || cat).join(', ');
  };

  return (
    <div>
      <header style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
        <span>Select Websites</span>
      </header>
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Choose websites</h1>
          
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Select from available websites to reach your target audience effectively.
          </p>
          
          <div style={{ 
            display: 'inline-block', 
            backgroundColor: '#e6f3ff', 
            padding: '8px 16px', 
            border: '1px solid #007bff',
            marginBottom: '20px'
          }}>
            <span>Your Category: </span>
            <strong>
              {businessCategory ? businessCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not Selected'}
            </strong>
          </div>
        </div>

        {error && (
          <div style={{ 
            border: '1px solid red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            marginBottom: '20px' 
          }}>
            <FileText size={20} />
            {error}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '20px',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#999'
            }} />
            <input 
              type="text" 
              placeholder="Search websites" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
            <Filter size={18} style={{ marginRight: '8px' }} />
            <span>
              Showing {filteredWebsites.length} available website{filteredWebsites.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredWebsites.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center', 
                padding: '40px',
                border: '1px solid #ddd'
              }}>
                <Globe size={48} style={{ margin: '0 auto 20px', color: '#999' }} />
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  No websites available at the moment
                </p>
                <p style={{ color: '#999', fontSize: '14px' }}>
                  Please check back later or contact support
                </p>
              </div>
            ) : (
              filteredWebsites.map((website) => (
                <div 
                  key={website._id} 
                  onClick={() => handleSelect(website._id)}
                  style={{
                    border: selectedWebsites.includes(website._id) ? '2px solid #007bff' : '1px solid #ddd',
                    padding: '20px',
                    cursor: 'pointer',
                    backgroundColor: selectedWebsites.includes(website._id) ? '#e6f3ff' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      border: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <img 
                        src={website.imageUrl || '/global.png'} 
                        alt={`${website.websiteName} logo`} 
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/global.png';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{website.websiteName}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{website.websiteLink}</p>
                    </div>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      border: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selectedWebsites.includes(website._id) ? '#007bff' : 'white',
                      color: selectedWebsites.includes(website._id) ? 'white' : 'transparent'
                    }}>
                      <Check size={16} />
                    </div>
                  </div>
                  
                  <div style={{ paddingTop: '15px', borderTop: '1px solid #eee' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: '#f0f0f0',
                      fontSize: '12px',
                      border: '1px solid #ddd'
                    }}>
                      {formatCategoryForDisplay(website.businessCategories)}
                    </span>
                    
                    {website.businessCategories && 
                     Array.isArray(website.businessCategories) &&
                     website.businessCategories.includes(businessCategory) && 
                     !website.businessCategories.includes('any') && (
                      <span style={{ 
                        display: 'inline-block',
                        marginLeft: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        fontSize: '12px',
                        border: '1px solid #c3e6cb'
                      }}>
                        Perfect Match
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ 
          marginTop: '40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {selectedWebsites.length > 0 && (
              <span>{selectedWebsites.length} website{selectedWebsites.length !== 1 ? 's' : ''} selected</span>
            )}
          </div>
          
          <button
            onClick={handleNext} 
            disabled={selectedWebsites.length === 0}
            style={{
              padding: '12px 24px',
              border: '1px solid #007bff',
              backgroundColor: selectedWebsites.length === 0 ? '#ccc' : '#007bff',
              color: 'white',
              cursor: selectedWebsites.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Processing...' : (
              <>
                <span>Continue</span>
                <PlusCircle size={16} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Websites;