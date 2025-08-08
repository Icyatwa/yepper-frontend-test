import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  DollarSign,
  RefreshCw,
  Wallet,
  AlertCircle,
  X
} from 'lucide-react';
import axios from 'axios';

import { Button, Heading, Badge, Container } from '../../components/components';

const AdReports = () => {
  const navigate = useNavigate();
  const [pendingAds, setPendingAds] = useState([]);
  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  useEffect(() => {
    Promise.all([
      fetchAdReports(),
      fetchWalletBalance()
    ]);
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ad-categories/wallet', {
        headers: getAuthHeaders()
      });
      setWalletBalance(response.data.wallet?.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

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

  const openRejectModal = (ad) => {
    const websiteSelection = ad.websiteSelections.find(sel => sel.approved && !sel.isRejected);
    if (!websiteSelection) return;

    // Check if sufficient balance for refund
    const paymentAmount = ad.paymentAmount || 0;
    if (walletBalance < paymentAmount) {
      alert('Insufficient balance in your wallet to process this rejection. Please contact support.');
      return;
    }

    setSelectedAd(ad);
    setShowRejectModal(true);
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
      await Promise.all([
        fetchAdReports(),
        fetchWalletBalance()
      ]);
      
      // Close modal
      setShowRejectModal(false);
      setSelectedAd(null);
      setRejectionReason('');
      
      // Show success message
      alert('Ad rejected successfully. Refund has been processed internally.');
      
    } catch (error) {
      console.error('Error rejecting ad:', error);
      const errorMessage = error.response?.data?.error || 'Failed to reject ad';
      alert(errorMessage);
      
      if (errorMessage.includes('Insufficient balance')) {
        // Refresh wallet balance if insufficient funds
        fetchWalletBalance();
      }
    } finally {
      setRejecting(null);
    }
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedAd(null);
    setRejectionReason('');
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const timeLeft = new Date(deadline) - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Wallet Balance */}
        <div className="flex items-center justify-between mb-8">
          <Heading level={1} className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            Ad Management Dashboard
          </Heading>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Wallet Balance: {formatCurrency(walletBalance)}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/wallet')}
              className="flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              View Wallet
            </Button>
          </div>
        </div>

        {/* Pending Rejections Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <Heading level={2} className="text-xl font-semibold">
              Pending Rejections ({pendingAds.length})
            </Heading>
          </div>
          
          {pendingAds.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No ads pending rejection review</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingAds.map((ad) => {
                const activeSelection = ad.websiteSelections.find(sel => sel.approved && !sel.isRejected);
                const timeRemaining = activeSelection?.rejectionDeadline ? 
                  getTimeRemaining(activeSelection.rejectionDeadline) : 'No deadline';
                
                return (
                  <div key={ad._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ad.businessName}</h3>
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            {timeRemaining}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {formatCurrency(ad.paymentAmount)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{ad.adDescription}</p>
                        <p className="text-sm text-gray-500">
                          Business Link: <a href={ad.businessLink} target="_blank" rel="noopener noreferrer" 
                                           className="text-blue-500 hover:underline">
                            {ad.businessLink}
                          </a>
                        </p>
                        <p className="text-sm text-gray-500">Location: {ad.businessLocation}</p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(ad.imageUrl || ad.videoUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openRejectModal(ad)}
                          disabled={rejecting === ad._id}
                        >
                          {rejecting === ad._id ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                    
                    {walletBalance < (ad.paymentAmount || 0) && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-700">
                          Insufficient wallet balance to reject this ad. Required: {formatCurrency(ad.paymentAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Ads Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <Heading level={2} className="text-xl font-semibold">
              Active Ads ({activeAds.length})
            </Heading>
          </div>
          
          {activeAds.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No active ads</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeAds.map((ad) => (
                <div key={ad._id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{ad.businessName}</h3>
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {formatCurrency(ad.paymentAmount)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{ad.adDescription}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Views: {ad.views || 0}</span>
                        <span>Clicks: {ad.clicks || 0}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(ad.imageUrl || ad.videoUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {showRejectModal && selectedAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Reject Advertisement</h3>
                <button
                  onClick={closeRejectModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  You are about to reject: <strong>{selectedAd.businessName}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Refund amount: <strong>{formatCurrency(selectedAd.paymentAmount)}</strong> 
                  will be transferred to advertiser's wallet
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Please provide a reason for rejecting this ad..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={closeRejectModal}
                  disabled={rejecting === selectedAd._id}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectAd}
                  disabled={!rejectionReason.trim() || rejecting === selectedAd._id}
                >
                  {rejecting === selectedAd._id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default AdReports;