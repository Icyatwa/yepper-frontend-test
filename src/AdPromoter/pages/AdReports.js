// AdReports.js - Page for web owners to see and reject ads on their sites
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, XCircle, Eye, DollarSign } from 'lucide-react';
import axios from 'axios';

const AdReports = () => {
  const navigate = useNavigate();
  const [pendingAds, setPendingAds] = useState([]);
  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  useEffect(() => {
    fetchAdReports();
  }, []);

  const fetchAdReports = async () => {
    try {
      const [pendingResponse, activeResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/ad-categories/pending-rejections', {
          headers: getAuthHeaders()
        }),
        axios.get('http://localhost:5000/api/ad-categories/active-ads', {
          headers: getAuthHeaders()
        })
      ]);

      setPendingAds(pendingResponse.data.pendingAds || []);
      setActiveAds(activeResponse.data.activeAds || []);
    } catch (error) {
      console.error('Error fetching ad reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAd = async () => {
    if (!selectedAd || !rejectionReason.trim()) return;

    setRejecting(selectedAd._id);
    try {
      const websiteSelection = selectedAd.websiteSelections.find(sel => sel.approved && !sel.isRejected);
      
      await axios.post(
        `http://localhost:5000/api/ad-categories/reject/${selectedAd._id}/${websiteSelection.websiteId}/${websiteSelection.categories[0]}`,
        { rejectionReason: rejectionReason.trim() },
        { headers: getAuthHeaders() }
      );

      // Refresh data
      await fetchAdReports();
      
      // Close modal
      setShowRejectModal(false);
      setSelectedAd(null);
      setRejectionReason('');
      
    } catch (error) {
      console.error('Error rejecting ad:', error);
      alert(error.response?.data?.error || 'Failed to reject ad');
    } finally {
      setRejecting(null);
    }
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const timeLeft = new Date(deadline) - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ad Management Reports</h1>

      {/* Pending Rejections Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Pending Rejections ({pendingAds.length})
        </h2>

        {pendingAds.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            No ads pending rejection
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingAds.map(ad => {
              const activeSelection = ad.websiteSelections.find(sel => sel.approved && !sel.isRejected);
              return (
                <div key={ad._id} className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{ad.businessName}</h3>
                      <p className="text-gray-600 mb-2">{ad.adDescription}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>💰 ${activeSelection?.categoryPrice || 'N/A'}</span>
                        <span>📍 {ad.businessLocation}</span>
                        <span>👀 {ad.views} views</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-orange-600 font-medium mb-2">
                        Time remaining: {getTimeRemaining(activeSelection?.rejectionDeadline)}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAd(ad);
                          setShowRejectModal(true);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        disabled={rejecting === ad._id}
                      >
                        {rejecting === ad._id ? 'Rejecting...' : 'Reject Ad'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Ads Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Active Ads ({activeAds.length})
        </h2>

        {activeAds.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            No active ads on your sites
          </div>
        ) : (
          <div className="grid gap-4">
            {activeAds.map(ad => (
              <div key={ad._id} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ad.businessName}</h3>
                    <p className="text-gray-600 mb-2">{ad.adDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📍 {ad.businessLocation}</span>
                      <span>👀 {ad.views} views</span>
                      <span>🖱️ {ad.clicks} clicks</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-green-600 font-medium">Active</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Advertisement</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject the ad for "{selectedAd?.businessName}"? 
              The payment will be refunded to the advertiser.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason for rejection:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border rounded-md"
                rows="3"
                placeholder="Please provide a reason..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAd(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectAd}
                disabled={!rejectionReason.trim() || rejecting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {rejecting ? 'Rejecting...' : 'Reject Ad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdReports;