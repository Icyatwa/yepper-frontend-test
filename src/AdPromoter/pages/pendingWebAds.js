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

  // Add debugging for user object
  useEffect(() => {
    console.log('🔍 Debug: Full user object:', user);
    console.log('🔍 Debug: user.id:', user?.id);
    console.log('🔍 Debug: user._id:', user?._id);
    console.log('🔍 Debug: token:', token);
    console.log('🔍 Debug: Object.keys(user):', user ? Object.keys(user) : 'user is null/undefined');
  }, [user, token]);

  useEffect(() => {
    const fetchPendingAds = async () => {
      // Check multiple possible user ID fields
      const userId = user?.id || user?._id || user?.userId;
      
      if (!userId) {
        console.log('❌ Debug: No user ID available');
        console.log('🔍 Debug: user object:', user);
        setLoading(false);
        return;
      }

      console.log('🔍 Debug: Fetching pending ads for user:', userId);
      console.log('🔍 Debug: Token available:', !!token);

      try {
        setLoading(true);
        setError(null);
        
        const url = `http://localhost:5000/api/ad-categories/pending/${userId}`;
        console.log('🔍 Debug: Making request to:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('🔍 Debug: Response status:', response.status);
        console.log('🔍 Debug: Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Debug: Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🔍 Debug: Response data:', data);
        console.log('🔍 Debug: Number of ads received:', data.length);
        
        setPendingAds(data);
      } catch (error) {
        console.error('❌ Error fetching pending ads:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAds();
  }, [user, token]); // Use entire user object as dependency

  const handleApprove = async (adId, websiteId) => {
    try {
      // Use the token from context directly instead of getToken()
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

      // Update local state to reflect the approval
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
      console.error('Error approving ad:', error);
      setError(`Error approving ad: ${error.message}`);
    }
  };

  // Show loading state while user is being loaded
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading user information...</p>
        </div>
      </div>
    );
  }

  // Show error if no user ID can be found
  if (!user?.id && !user?._id && !user?.userId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto backdrop-blur-md bg-red-900/30 rounded-xl border border-red-500/30 p-8">
          <div className="text-center">
            <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-white/70 mb-4">Unable to identify user. Please log in again.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
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
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">APPROVAL</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-blue-500 mr-6"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Administration</span>
            <div className="h-px w-12 bg-blue-500 ml-6"></div>
          </div>
          
          <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Ad Approval Dashboard
            </span>
          </h1>
          
          {/* Debug info - remove this in production */}
          <div className="text-center text-sm text-white/50 mb-4">
            Debug: User ID = {user?.id || user?._id || user?.userId || 'Not found'}
          </div>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-16 backdrop-blur-md bg-red-900/30 rounded-xl border border-red-500/30 p-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-400 mr-3" size={24} />
              <p className="text-white/90">Error loading pending ads: {error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/70">Loading pending ads...</p>
          </div>
        ) : pendingAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingAds.map((ad) => (
              <div 
                key={ad._id}
                className="group backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]"
              >
                <div className="relative aspect-video">
                  {ad.videoUrl ? (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      className="w-full h-full object-cover"
                    >
                      <source src={ad.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    ad.imageUrl && (
                      <img 
                        src={ad.imageUrl} 
                        alt={`${ad.businessName} ad visual`}
                        className="w-full h-full object-cover"
                      />
                    )
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {ad.businessName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold mb-3">{ad.businessName}</h3>
                  <p className="text-white/70 mb-6">{ad.adDescription}</p>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium uppercase tracking-wider text-purple-400">Selected Websites</h4>
                    {ad.websiteDetails.map((detail) => (
                      <div key={detail.website._id} className="border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md bg-white/5">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">{detail.website.websiteName}</h5>
                          <div className={`flex items-center px-3 py-1 rounded-full text-xs ${
                            detail.approved 
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {detail.approved ? (
                              <>
                                <CheckCircle size={12} className="mr-1" />
                                <span>Approved</span>
                              </>
                            ) : (
                              <>
                                <Clock size={12} className="mr-1" />
                                <span>Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-white/70">
                          <p className="mb-1">Selected Categories:</p>
                          <div className="flex flex-wrap gap-2">
                            {detail.categories.map(cat => (
                              <span key={cat._id} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                                {cat.categoryName}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {!detail.approved && (
                          <button 
                            onClick={() => handleApprove(ad._id, detail.website._id)}
                            className="w-full group relative h-12 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center justify-center">
                              <CheckCircle size={16} className="mr-2" />
                              <span className="uppercase tracking-wider">Approve for {detail.website.websiteName}</span>
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto backdrop-blur-md bg-gradient-to-b from-gray-900/30 to-gray-900/10 rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/5">
                  <AlertCircle className="text-white/70" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">No Pending Ads</h2>
                  <p className="text-white/60">All advertisements have been reviewed. Check back later for new submissions.</p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="group relative h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="uppercase tracking-wider">Return to Dashboard</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PendingAds;