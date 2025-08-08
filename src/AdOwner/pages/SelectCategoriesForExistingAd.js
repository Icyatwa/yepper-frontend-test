// SelectCategoriesForExistingAd.js - Enhanced with smart refund UI
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, DollarSign, Globe, CreditCard, CheckCircle, AlertCircle, RefreshCw, Wallet, TrendingUp } from 'lucide-react';

function SelectCategoriesForExistingAd() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adId, selectedWebsites, ad, isReassignment, availableRefund } = location.state || {};
  const [categoriesByWebsite, setCategoriesByWebsite] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [paymentSelections, setPaymentSelections] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({}); // Track payment status for each selection
  const [successfulPayments, setSuccessfulPayments] = useState([]);
  
  // ENHANCED: New state for refund management
  const [refundInfo, setRefundInfo] = useState({
    totalAvailable: 0,
    totalApplicable: 0,
    totalRemaining: 0,
    details: []
  });
  const [fullyBookedCategories, setFullyBookedCategories] = useState([]);

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
    if (!adId || !selectedWebsites || !ad) {
      navigate('/my-ads');
      return;
    }
    fetchCategories();
    // ENHANCED: Fetch refund information
    fetchRefundInfo();
  }, [adId, selectedWebsites]);

  useEffect(() => {
    calculateTotal();
  }, [selectedCategories, categoriesByWebsite, refundInfo]);

  // ENHANCED: Fetch refund information
  const fetchRefundInfo = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/web-advertise/payment/refund-balance',
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        setRefundInfo({
          totalAvailable: response.data.totalAvailableRefunds,
          details: response.data.refundDetails
        });
      }
    } catch (error) {
      console.error('Error fetching refund info:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const promises = selectedWebsites.map(async (websiteId) => {
        const [websiteResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/createWebsite/website/${websiteId}`),
          axios.get(`http://localhost:5000/api/ad-categories/${websiteId}/advertiser`, {
            headers: getAuthHeaders()
          })
        ]);

        return {
          websiteId: websiteId,
          websiteName: websiteResponse.data.websiteName || 'Unknown Website',
          websiteLink: websiteResponse.data.websiteLink || '#',
          categories: categoriesResponse.data.categories || [],
        };
      });
      
      const result = await Promise.all(promises);
      setCategoriesByWebsite(result.filter(Boolean));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // ENHANCED: Smart cost calculation with refund application
  const calculateTotal = () => {
    let totalCost = 0;
    let totalRefundApplicable = 0;
    let remainingRefundBalance = refundInfo.totalAvailable;
    
    const categoryDetails = selectedCategories.map(categoryId => {
      const category = findCategoryById(categoryId);
      const price = category ? category.price : 0;
      const refundApplicable = Math.min(remainingRefundBalance, price);
      const remainingCost = Math.max(0, price - refundApplicable);
      
      remainingRefundBalance -= refundApplicable;
      totalCost += price;
      totalRefundApplicable += refundApplicable;
      
      return {
        categoryId,
        categoryName: category?.categoryName || 'Unknown',
        price,
        refundApplicable,
        remainingCost
      };
    });

    setTotalCost(totalCost);
    setRefundInfo(prev => ({
      ...prev,
      totalApplicable: totalRefundApplicable,
      totalRemaining: totalCost - totalRefundApplicable,
      categoryBreakdown: categoryDetails
    }));
  };

  const findCategoryById = (categoryId) => {
    for (const website of categoriesByWebsite) {
      const category = website.categories.find(cat => cat._id === categoryId);
      if (category) return category;
    }
    return null;
  };

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getSelectedCategoryDetails = () => {
    const details = [];
    selectedCategories.forEach(categoryId => {
      categoriesByWebsite.forEach(website => {
        const category = website.categories.find(cat => cat._id === categoryId);
        if (category) {
          details.push({
            categoryId: category._id,
            websiteId: website.websiteId,
            websiteName: website.websiteName,
            categoryName: category.categoryName,
            price: category.price
          });
        }
      });
    });
    return details;
  };

  // ENHANCED: Handle add selections with fully booked category detection
  const handleAddSelections = async () => {
    if (selectedCategories.length === 0) return;

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/web-advertise/${adId}/add-selections`,
        {
          selectedWebsites: JSON.stringify(selectedWebsites),
          selectedCategories: JSON.stringify(selectedCategories),
          isReassignment: isReassignment
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Instead of navigating, show payment summary
        setPaymentSelections(response.data.data.paymentSelections);
        setRefundInfo(prev => ({
          ...prev,
          totalApplicable: response.data.data.refundSavings || 0,
          totalRemaining: response.data.data.totalRemainingCost || 0
        }));
        setShowPaymentSummary(true);
      }
    } catch (error) {
      // ENHANCED: Handle fully booked categories error
      if (error.response?.status === 409 && error.response?.data?.fullyBookedCategories) {
        setFullyBookedCategories(error.response.data.fullyBookedCategories);
        alert(`Some categories are fully booked:\n${error.response.data.fullyBookedCategories.map(cat => 
          `• ${cat.name} (${cat.currentSlots}/${cat.maxSlots} slots)`
        ).join('\n')}\n\nPlease select other available categories.`);
      } else {
        alert('Error adding website selections: ' + (error.response?.data?.error || 'Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ENHANCED: Smart payment handling with automatic refund application
  const handlePayment = async (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    
    try {
      setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'processing' }));
      
      // ENHANCED: Always use the smart refund endpoint
      const response = await axios.post(
        'http://localhost:5000/api/web-advertise/payment/initiate-with-refund',
        {
          adId: adId,
          websiteId: selection.websiteId,
          categoryId: selection.categoryId
          // No need to specify useRefundAmount - backend automatically applies optimal refund
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        if (response.data.paymentMethod === 'refund_only') {
          // Payment completed with refund only
          setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'success' }));
          setSuccessfulPayments(prev => [...prev, {
            ...selection,
            refundApplied: response.data.refundApplied,
            paymentMethod: 'refund_only'
          }]);
          
          // ENHANCED: Update refund info after successful refund-only payment
          fetchRefundInfo();
        } else {
          // Redirect to Flutterwave for remaining amount
          window.location.href = response.data.paymentUrl;
        }
      } else {
        setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'failed' }));
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // ENHANCED: Handle specific error cases
      if (error.response?.data?.isFullyBooked) {
        setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'fully_booked' }));
        alert(`Category "${selection.categoryName}" is now fully booked. Please select another category.`);
      } else {
        setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'failed' }));
        alert('Payment failed: ' + (error.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const isPaymentDisabled = (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    const status = paymentStatus[selectionKey];
    return status === 'processing' || status === 'success' || status === 'fully_booked';
  };

  const getPaymentButtonText = (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    const status = paymentStatus[selectionKey];
    
    switch (status) {
      case 'processing': return 'Processing...';
      case 'success': return 'Completed';
      case 'fully_booked': return 'Fully Booked';
      case 'failed': return 'Retry Payment';
      default: 
        if (selection.canUseRefundOnly) {
          return 'Use Refund Credits';
        }
        return selection.remainingCost === 0 ? 'Free' : `Pay $${selection.remainingCost}`;
    }
  };

  const allPaymentsComplete = () => {
    return paymentSelections.every(selection => {
      const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
      return paymentStatus[selectionKey] === 'success';
    });
  };

  // ENHANCED: Payment Summary Modal with detailed refund breakdown
  if (showPaymentSummary) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Summary</h1>
                <p className="text-gray-600 mt-1">
                  {isReassignment ? 'Reassigning' : 'Publishing'} "{ad.businessName}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-green-600" />
                <div className="text-right">
                  <div className="text-sm text-gray-600">Available Refunds</div>
                  <div className="text-lg font-bold text-green-600">
                    ${refundInfo.totalAvailable.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ENHANCED: Refund Savings Summary */}
          {refundInfo.totalApplicable > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">Smart Refund Applied!</div>
                  <div className="text-sm text-green-700">
                    You're saving ${refundInfo.totalApplicable.toFixed(2)} using your available refund credits
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Items */}
          <div className="space-y-4 mb-6">
            {paymentSelections.map((selection, index) => {
              const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
              const status = paymentStatus[selectionKey];
              const isCompleted = status === 'success';
              const isProcessing = status === 'processing';
              const isFailed = status === 'failed';
              const isFullyBooked = status === 'fully_booked';

              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{selection.categoryName}</h3>
                      <p className="text-sm text-gray-600">Original Price: ${selection.price.toFixed(2)}</p>
                      
                      {/* ENHANCED: Refund breakdown for each selection */}
                      {selection.availableRefund > 0 && (
                        <div className="mt-2 text-sm">
                          <div className="text-green-600">
                            - Refund Applied: ${selection.availableRefund.toFixed(2)}
                          </div>
                          <div className="font-medium text-gray-900">
                            Amount to Pay: ${selection.remainingCost.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status indicator */}
                      {isCompleted && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                      {isFullyBooked && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Fully Booked</span>
                        </div>
                      )}
                      {isFailed && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Failed</span>
                        </div>
                      )}

                      {/* Payment button */}
                      <button
                        onClick={() => handlePayment(selection)}
                        disabled={isPaymentDisabled(selection)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : isProcessing
                            ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                            : isFullyBooked
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : isFailed
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : selection.remainingCost === 0
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isProcessing && <RefreshCw className="w-4 h-4 animate-spin mr-2 inline" />}
                        {getPaymentButtonText(selection)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ENHANCED: Total summary with refund breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Original Total:</span>
                <span>${paymentSelections.reduce((sum, sel) => sum + sel.price, 0).toFixed(2)}</span>
              </div>
              {refundInfo.totalApplicable > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Refund Credits Applied:</span>
                  <span>-${refundInfo.totalApplicable.toFixed(2)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total to Pay:</span>
                <span>${refundInfo.totalRemaining.toFixed(2)}</span>
              </div>
              {refundInfo.totalRemaining === 0 && (
                <div className="text-center text-green-600 font-medium mt-2">
                  🎉 Fully covered by refund credits!
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowPaymentSummary(false)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Selection
            </button>
            
            {allPaymentsComplete() && (
              <button
                onClick={() => navigate('/my-ads')}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View My Ads
              </button>
            )}
          </div>

          {/* Success message */}
          {successfulPayments.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="text-green-800 font-medium">
                  {successfulPayments.length} payment{successfulPayments.length > 1 ? 's' : ''} completed successfully!
                </div>
              </div>
              {successfulPayments.some(p => p.paymentMethod === 'refund_only') && (
                <div className="text-sm text-green-700 mt-1">
                  Some payments were completed using your refund credits.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main category selection UI
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isReassignment ? 'Reassign Advertisement' : 'Select Advertisement Categories'}
              </h1>
              <p className="text-gray-600 mt-1">
                Choose categories for "{ad?.businessName}" 
                {isReassignment && ' (reassignment after rejection)'}
              </p>
            </div>
          </div>

          {/* ENHANCED: Refund information display */}
          {refundInfo.totalAvailable > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-800">
                      Refund Credits Available: ${refundInfo.totalAvailable.toFixed(2)}
                    </div>
                    <div className="text-sm text-blue-700">
                      These credits will be automatically applied to reduce your payment
                    </div>
                  </div>
                </div>
                {refundInfo.details && refundInfo.details.length > 0 && (
                  <div className="text-right text-sm text-blue-600">
                    {refundInfo.details.length} refund{refundInfo.details.length > 1 ? 's' : ''} available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Category selection */}
            <div className="grid gap-6 mb-8">
              {categoriesByWebsite.map((website) => (
                <div key={website.websiteId} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {website.websiteName}
                        </h3>
                        <a 
                          href={website.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {website.websiteLink}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {website.categories.map((category) => {
                        const isSelected = selectedCategories.includes(category._id);
                        const isFullyBooked = fullyBookedCategories.some(fb => fb.id === category._id);
                        const categoryRefund = Math.min(refundInfo.totalAvailable, category.price);
                        const remainingCost = Math.max(0, category.price - categoryRefund);
                        
                        return (
                          <div
                            key={category._id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              isFullyBooked
                                ? 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                            onClick={() => !isFullyBooked && handleCategorySelection(category._id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {category.categoryName}
                                </h4>
                                {category.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {category.description}
                                  </p>
                                )}
                                
                                {/* ENHANCED: Price breakdown with refund info */}
                                <div className="mt-2">
                                  <div className="text-lg font-bold text-gray-900">
                                    ${category.price.toFixed(2)}
                                  </div>
                                  {categoryRefund > 0 && !isFullyBooked && (
                                    <div className="text-sm text-green-600">
                                      ${categoryRefund.toFixed(2)} refund applicable
                                    </div>
                                  )}
                                  {remainingCost < category.price && !isFullyBooked && (
                                    <div className="text-sm font-medium text-blue-600">
                                      Pay only: ${remainingCost.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                                
                                {isFullyBooked && (
                                  <div className="mt-2 text-sm text-red-600 font-medium">
                                    Fully Booked
                                  </div>
                                )}
                              </div>
                              
                              <div className="ml-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isFullyBooked
                                    ? 'border-red-300 bg-red-100'
                                    : isSelected
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && !isFullyBooked && (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  )}
                                  {isFullyBooked && (
                                    <AlertCircle className="w-3 h-3 text-red-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ENHANCED: Smart summary footer */}
            {selectedCategories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky bottom-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Original total: ${totalCost.toFixed(2)}
                      {refundInfo.totalApplicable > 0 && (
                        <>
                          {' • '}
                          <span className="text-green-600">
                            ${refundInfo.totalApplicable.toFixed(2)} refund savings
                          </span>
                        </>
                      )}
                    </div>
                    {refundInfo.totalRemaining !== totalCost && (
                      <div className="text-lg font-bold text-blue-600 mt-1">
                        Amount to pay: ${refundInfo.totalRemaining.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleAddSelections}
                    disabled={isSubmitting || selectedCategories.length === 0}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Processing...' : `Proceed to Payment`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SelectCategoriesForExistingAd;