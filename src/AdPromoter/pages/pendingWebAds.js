import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PendingAds = () => {
  const { user, token } = useAuth();
  const [pendingAds, setPendingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingAds = async () => {
      const userId = user?.id || user?._id || user?.userId;
      
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:5000/api/ad-categories/pending/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPendingAds(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAds();
  }, [user, token]);

  const handleApprove = async (adId, websiteId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ad-categories/approve/${adId}/website/${websiteId}`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPendingAds(prevAds => 
        prevAds.map(ad => {
          if (ad._id === adId) {
            return {
              ...ad,
              websiteDetails: ad.websiteDetails.map(wd => ({
                ...wd,
                approved: wd.website._id === websiteId ? true : wd.approved
              }))
            };
          }
          return ad;
        })
      );
    } catch (error) {
      setError(`Error approving ad: ${error.message}`);
    }
  };

  if (loading && !user) {
    return <div>Loading user information...</div>;
  }

  if (!user?.id && !user?._id && !user?.userId) {
    return (
      <div>
        <h2>Authentication Error</h2>
        <p>Unable to identify user. Please log in again.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
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
        <h1>Ad Approval Dashboard</h1>
      </header>
      
      <main style={{ padding: '20px' }}>
        {error && (
          <div style={{ border: '1px solid red', padding: '10px', marginBottom: '20px' }}>
            <AlertCircle size={20} />
            Error: {error}
          </div>
        )}

        {loading ? (
          <div>Loading pending ads...</div>
        ) : pendingAds.length > 0 ? (
          <div>
            {pendingAds.map((ad) => (
              <div key={ad._id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '15px' }}>
                <div style={{ border: '1px solid #eee', marginBottom: '10px' }}>
                  {ad.videoUrl ? (
                    <video width="300" height="200" controls>
                      <source src={ad.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    ad.imageUrl && (
                      <img 
                        src={ad.imageUrl} 
                        alt={`${ad.businessName} ad`}
                        style={{ width: '300px', height: '200px', objectFit: 'cover' }}
                      />
                    )
                  )}
                </div>

                <h3>{ad.businessName}</h3>
                <p>{ad.adDescription}</p>
                
                <div style={{ border: '1px solid #eee', padding: '10px', marginTop: '10px' }}>
                  <h4>Selected Websites:</h4>
                  {ad.websiteDetails.map((detail) => (
                    <div key={detail.website._id} style={{ border: '1px solid #ccc', margin: '5px 0', padding: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5>{detail.website.websiteName}</h5>
                        <span style={{ 
                          padding: '2px 8px', 
                          border: '1px solid #ccc',
                          backgroundColor: detail.approved ? '#d4edda' : '#fff3cd'
                        }}>
                          {detail.approved ? (
                            <>
                              <CheckCircle size={12} />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                      
                      <div>
                        <p>Categories:</p>
                        {detail.categories.map(cat => (
                          <span key={cat._id} style={{ 
                            border: '1px solid #ccc', 
                            padding: '2px 6px', 
                            margin: '2px',
                            display: 'inline-block'
                          }}>
                            {cat.categoryName}
                          </span>
                        ))}
                      </div>
                      
                      {!detail.approved && (
                        <button 
                          onClick={() => handleApprove(ad._id, detail.website._id)}
                          style={{ 
                            marginTop: '10px',
                            padding: '8px 16px',
                            border: '1px solid #007bff',
                            backgroundColor: '#007bff',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <CheckCircle size={16} />
                          Approve for {detail.website.websiteName}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
            <AlertCircle size={32} />
            <h2>No Pending Ads</h2>
            <p>All advertisements have been reviewed.</p>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                padding: '10px 20px',
                border: '1px solid #007bff',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PendingAds;