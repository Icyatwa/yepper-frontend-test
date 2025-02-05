import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { Check, Eye, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from "./components/card";
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import Header from '../../components/backToPreviousHeader'

const PendingAds = () => {
  const [pendingAds, setPendingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPendingAds = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Get the token from Clerk
        const token = await getToken();
        
        const response = await fetch(`https://yepper-backend-test.onrender.com/api/accept/pending/${user.id}`, {
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
        console.error('Error fetching pending ads:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAds();
  }, [user?.id, getToken]);

  const handleApprove = async (adId, websiteId) => {
    try {
      const token = await getToken();
      
      const response = await fetch(
        `https://yepper-backend-test.onrender.com/api/accept/approve/${adId}/website/${websiteId}`, 
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
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading pending ads: {error}</div>;

  return (
    <div className="ad-waitlist min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-2">
                Ad Approval Dashboard
              </h1>
              <p className="text-gray-600">
                {pendingAds.length} {pendingAds.length === 1 ? 'advertisement' : 'advertisements'} awaiting review
              </p>
            </div>
          </div>
        </div>

        {pendingAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {pendingAds.map((ad) => (
              <Card 
                key={ad._id} 
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
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

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">{ad.businessName}</h3>
                    <p className="text-sm text-gray-600">{ad.adDescription}</p>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Selected Websites:</h4>
                      {ad.websiteDetails.map((detail) => (
                        <div key={detail.website._id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">{detail.website.websiteName}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              detail.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {detail.approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p>Selected Categories:</p>
                            <ul className="list-disc list-inside">
                              {detail.categories.map(cat => (
                                <li key={cat._id}>{cat.categoryName}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {!detail.approved && (
                            <button 
                              onClick={() => handleApprove(ad._id, detail.website._id)}
                              className="w-full mt-2 px-3 py-2 bg-[#FF4500] hover:bg-orange-500 text-white text-sm font-bold rounded-md transition-all duration-300"
                            >
                              Approve for {detail.website.websiteName}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50">
                  <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">No Pending Ads</h2>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PendingAds;