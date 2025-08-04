// AdvertiserDashboard.js - Page for advertisers to see rejected ads and budget
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AdvertiserDashboard = () => {
  const navigate = useNavigate();
  const [userAds, setUserAds] = useState([]);
  const [adBudget, setAdBudget] = useState({ available: 0, spent: 0, refunded: 0 });
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  useEffect(() => {
    fetchAdvertiserData();
  }, []);

  const fetchAdvertiserData = async () => {
    try {
      const [adsResponse, budgetResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/web-advertise/my-ads', {
          headers: getAuthHeaders()
        }),
        axios.get('http://localhost:5000/api/web-advertise/budget', {
          headers: getAuthHeaders()
        })
      ]);

      setUserAds(adsResponse.data.ads || []);
      setAdBudget(budgetResponse.data.budget || { available: 0, spent: 0, refunded: 0 });
    } catch (error) {
      console.error('Error fetching advertiser data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAdStatus = (ad) => {
    const hasActiveSelection = ad.websiteSelections.some(sel => 
      sel.approved && !sel.isRejected && sel.status === 'active'
    );
    const hasRejectedSelection = ad.websiteSelections.some(sel => sel.isRejected);
    const hasAvailableForReassignment = ad.availableForReassignment;

    if (hasActiveSelection) return { status: 'active', label: 'Active', color: 'green' };
    if (hasRejectedSelection && hasAvailableForReassignment) return { status: 'rejected', label: 'Rejected - Available for Others', color: 'yellow' };
    if (hasRejectedSelection) return { status: 'rejected', label: 'Rejected', color: 'red' };
    if (ad.websiteSelections.length === 0) return { status: 'unassigned', label: 'Not Assigned', color: 'gray' };
    return { status: 'pending', label: 'Pending', color: 'blue' };
  };

  const getRejectionInfo = (ad) => {
    const rejectedSelection = ad.websiteSelections.find(sel => sel.isRejected);
    return rejectedSelection ? {
      reason: rejectedSelection.rejectionReason,
      date: rejectedSelection.rejectedAt,
      website: rejectedSelection.websiteName
    } : null;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Advertiser Dashboard</h1>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Available Budget</p>
              <p className="text-2xl font-bold text-green-600">${adBudget.available}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Spent</p>
              <p className="text-2xl font-bold text-blue-600">${adBudget.spent}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Refunded</p>
              <p className="text-2xl font-bold text-orange-600">${adBudget.refunded}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* My Ads */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Advertisements</h2>

        {userAds.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">You haven't created any ads yet.</p>
            <button
              onClick={() => navigate('/categories')}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Create Your First Ad
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {userAds.map(ad => {
              const adStatus = getAdStatus(ad);
              const rejectionInfo = getRejectionInfo(ad);

              return (
                <div key={ad._id} className="bg-white border rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {ad.imageUrl && (
                          <img
                            src={ad.imageUrl}
                            alt={ad.businessName}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{ad.businessName}</h3>
                          <p className="text-gray-600 mb-3">{ad.adDescription}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>📍 {ad.businessLocation}</span>
                            <span>👀 {ad.views} views</span>
                            <span>🖱️ {ad.clicks} clicks</span>
                          </div>

                          {/* Status-specific messages */}
                          {adStatus.status === 'rejected' && rejectionInfo && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-yellow-800">Your ad was rejected</p>
                                  <p className="text-yellow-700 text-sm">Reason: {rejectionInfo.reason}</p>
                                  <p className="text-yellow-600 text-xs mt-1">
                                    Rejected on {new Date(rejectionInfo.date).toLocaleDateString()}
                                  </p>
                                  {ad.availableForReassignment && (
                                    <p className="text-green-700 text-sm mt-2 font-medium">
                                      ✅ Good news! Your payment has been refunded and your ad is now available 
                                      for other website owners to pick up at no additional cost to you.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {adStatus.status === 'unassigned' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                              <p className="text-blue-800 text-sm">
                                💡 Your ad is available for website owners to discover and add to their sites
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                        ${adStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                          adStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          adStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                          adStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        
                        {adStatus.status === 'active' && <CheckCircle className="w-4 h-4" />}
                        {adStatus.status === 'rejected' && <XCircle className="w-4 h-4" />}
                        {adStatus.status === 'rejected' && <RefreshCw className="w-4 h-4" />}
                        
                        {adStatus.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertiserDashboard;