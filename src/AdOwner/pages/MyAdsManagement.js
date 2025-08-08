// MyAdsManagement.js - Page for advertisers to manage their ads
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Plus, 
  Edit, 
  Eye, 
  RefreshCw,
  DollarSign,
  Globe
} from 'lucide-react';

function MyAdsManagement() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);
  const [refundInfo, setRefundInfo] = useState({});

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
    fetchUserInfo();
    fetchUserAds();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: getAuthHeaders()
      });
      setUser(response.data.user);
    } catch (error) {
      navigate('/login');
    }
  };

  const fetchUserAds = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/web-advertise/my-ads', {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        const adsData = response.data.ads || [];
        setAds(adsData);
        
        // Fetch refund info for ads that might have refunds
        adsData.forEach(ad => {
          if (ad.canReassign || ad.rejectedSelections > 0) {
            fetchRefundInfo(ad._id);
          }
        });
      } else {
        setAds([]);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundInfo = async (adId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/web-advertise/${adId}/refund-info`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setRefundInfo(prev => ({
          ...prev,
          [adId]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching refund info:', error);
    }
  };

  const getAdStatus = (ad) => {
    // No websites selected
    if (!ad.websiteSelections || ad.websiteSelections.length === 0) {
      return { 
        status: 'No Websites Selected', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100', 
        icon: Globe,
        canReassign: true
      };
    }
    
    const activeSelections = ad.websiteSelections.filter(ws => ws.status === 'active' && !ws.isRejected).length;
    const pendingSelections = ad.websiteSelections.filter(ws => ws.status === 'pending' && !ws.isRejected).length;
    const rejectedSelections = ad.websiteSelections.filter(ws => ws.isRejected || ws.status === 'rejected').length;
    
    // Has active selections
    if (activeSelections > 0) {
      const hasRejected = rejectedSelections > 0;
      return { 
        status: hasRejected 
          ? `Active on ${activeSelections} site(s), ${rejectedSelections} rejected`
          : `Active on ${activeSelections} website(s)`, 
        color: hasRejected ? 'text-yellow-600' : 'text-green-600', 
        bgColor: hasRejected ? 'bg-yellow-100' : 'bg-green-100', 
        icon: hasRejected ? AlertCircle : CheckCircle,
        canReassign: hasRejected
      };
    }
    
    // Has pending selections
    if (pendingSelections > 0) {
      const hasRejected = rejectedSelections > 0;
      return { 
        status: hasRejected 
          ? `Pending on ${pendingSelections} site(s), ${rejectedSelections} rejected`
          : `Pending on ${pendingSelections} website(s)`, 
        color: hasRejected ? 'text-red-600' : 'text-yellow-600', 
        bgColor: hasRejected ? 'bg-red-100' : 'bg-yellow-100', 
        icon: hasRejected ? XCircle : Clock,
        canReassign: hasRejected
      };
    }
    
    // All rejected
    if (rejectedSelections > 0) {
      return { 
        status: `Rejected by ${rejectedSelections} website(s)`, 
        color: 'text-red-600', 
        bgColor: 'bg-red-100', 
        icon: XCircle,
        canReassign: true
      };
    }
    
    return { 
      status: 'Unknown', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100', 
      icon: AlertCircle,
      canReassign: false
    };
  };

  const safeAds = Array.isArray(ads) ? ads : [];

  const filteredAds = safeAds.filter(ad => {
    if (filter === 'all') return true;
    if (filter === 'no_websites') return !ad.websiteSelections || ad.websiteSelections.length === 0;
    if (filter === 'active') return ad.websiteSelections && ad.websiteSelections.some(ws => ws.status === 'active' && !ws.isRejected);
    if (filter === 'pending') return ad.websiteSelections && ad.websiteSelections.some(ws => ws.status === 'pending' && !ws.isRejected);
    if (filter === 'rejected') return ad.websiteSelections && ad.websiteSelections.some(ws => ws.isRejected || ws.status === 'rejected');
    if (filter === 'reassignable') return getAdStatus(ad).canReassign;
    return true;
  });

  const handleAddWebsites = (adId) => {
    navigate('/select-websites-for-ad', {
      state: { adId }
    });
  };

  const handleReassignAd = (adId) => {
    const ad = ads.find(a => a._id === adId);
    navigate('/select-websites-for-ad', {
      state: { 
        adId,
        isReassignment: true,
        availableRefund: refundInfo[adId]?.totalRefundAmount || 0
      }
    });
  };

  const handleEditAd = (adId) => {
    navigate(`/edit-ad/${adId}`);
  };

  const handleViewDetails = (adId) => {
    navigate(`/ad-details/${adId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your ads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Advertisement Campaigns</h1>
          <p className="mt-2 text-gray-600">Manage your ads and track their performance</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Ads', count: safeAds.length },
                { key: 'no_websites', label: 'Need Websites', count: safeAds.filter(ad => !ad.websiteSelections || ad.websiteSelections.length === 0).length },
                { key: 'active', label: 'Active', count: safeAds.filter(ad => ad.websiteSelections && ad.websiteSelections.some(ws => ws.status === 'active' && !ws.isRejected)).length },
                { key: 'pending', label: 'Pending', count: safeAds.filter(ad => ad.websiteSelections && ad.websiteSelections.some(ws => ws.status === 'pending' && !ws.isRejected)).length },
                { key: 'rejected', label: 'Rejected', count: safeAds.filter(ad => ad.websiteSelections && ad.websiteSelections.some(ws => ws.isRejected || ws.status === 'rejected')).length },
                { key: 'reassignable', label: 'Can Reassign', count: safeAds.filter(ad => getAdStatus(ad).canReassign).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Ads Grid */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No ads found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'Get started by creating your first ad.' : `No ads match the "${filter}" filter.`}
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/create-ad')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Ad
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAds.map((ad) => {
              const status = getAdStatus(ad);
              const StatusIcon = status.icon;
              const adRefundInfo = refundInfo[ad._id];

              return (
                <div key={ad._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <StatusIcon className={`h-6 w-6 ${status.color}`} />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {ad.businessName}
                          </dt>
                          <dd className={`text-sm ${status.color}`}>
                            {status.status}
                          </dd>
                        </dl>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.canReassign ? 'Can Reassign' : 'Active'}
                      </div>
                    </div>

                    {/* Show refund info if available */}
                    {adRefundInfo && adRefundInfo.totalRefundAmount > 0 && (
                      <div className="mt-3 p-2 bg-green-50 rounded-md">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-700">
                            Available Refund: ${adRefundInfo.totalRefundAmount}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {ad.adDescription || 'No description provided'}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>Created {new Date(ad.createdAt).toLocaleDateString()}</span>
                      <span>{ad.views || 0} views • {ad.clicks || 0} clicks</span>
                    </div>

                    <div className="mt-5 flex justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(ad._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditAd(ad._id)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        {status.canReassign ? (
                          <button
                            onClick={() => handleReassignAd(ad._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Reassign
                          </button>
                        ) : (!ad.websiteSelections || ad.websiteSelections.length === 0) ? (
                          <button
                            onClick={() => handleAddWebsites(ad._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Websites
                          </button>
                        ) : null}
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
}

export default MyAdsManagement;