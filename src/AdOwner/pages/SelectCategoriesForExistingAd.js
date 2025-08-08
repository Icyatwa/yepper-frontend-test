import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, DollarSign, Globe, CreditCard, CheckCircle, AlertCircle, RefreshCw, Wallet, TrendingUp, Calculator } from 'lucide-react';

function SelectCategoriesForExistingAd() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adId, selectedWebsites, ad, isReassignment, availableRefund } = location.state || {};
  const [categoriesByWebsite, setCategoriesByWebsite] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [paymentSelections, setPaymentSelections] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [successfulPayments, setSuccessfulPayments] = useState([]);
  const [fullyBookedCategories, setFullyBookedCategories] = useState([]);
  
  // ENHANCED: Improved refund state management
  const [refundInfo, setRefundInfo] = useState({
    totalAvailable: 0,
    details: []
  });

  // ENHANCED: Smart calculation state
  const [calculationResult, setCalculationResult] = useState({
    totalOriginalCost: 0,
    totalRefundApplied: 0,
    totalRemainingCost: 0,
    categoryBreakdown: [],
    refundEfficiency: 0
  });

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
    fetchRefundInfo();
  }, [adId, selectedWebsites]);

  useEffect(() => {
    calculateSmartRefundDistribution();
  }, [selectedCategories, categoriesByWebsite, refundInfo.totalAvailable]);

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

  // ENHANCED: Smart refund distribution calculation
  const calculateSmartRefundDistribution = () => {
    if (selectedCategories.length === 0) {
      setCalculationResult({
        totalOriginalCost: 0,
        totalRefundApplied: 0,
        totalRemainingCost: 0,
        categoryBreakdown: [],
        refundEfficiency: 0
      });
      return;
    }

    // Get all selected category details with prices
    const categoryDetails = [];
    
    selectedCategories.forEach(categoryId => {
      categoriesByWebsite.forEach(website => {
        const category = website.categories.find(cat => cat._id === categoryId);
        if (category) {
          categoryDetails.push({
            categoryId: category._id,
            websiteId: website.websiteId,
            websiteName: website.websiteName,
            categoryName: category.categoryName,
            price: category.price
          });
        }
      });
    });

    // Sort by price (ascending) to maximize refund efficiency
    categoryDetails.sort((a, b) => a.price - b.price);
    
    // FIXED: Use the actual available refund amount, not per category
    let remainingRefunds = refundInfo.totalAvailable; // This should be $10 total, not per category
    let totalOriginalCost = 0;
    let totalRefundApplied = 0;
    
    const categoryBreakdown = categoryDetails.map(category => {
      // FIXED: Calculate refund applicable per category correctly
      const refundApplicable = Math.min(remainingRefunds, category.price);
      const remainingCost = category.price - refundApplicable;
      
      // FIXED: Subtract the used refund from remaining refunds
      remainingRefunds = Math.max(0, remainingRefunds - refundApplicable);
      totalOriginalCost += category.price;
      totalRefundApplied += refundApplicable;
      
      return {
        ...category,
        refundApplicable,
        remainingCost,
        isFullyCovered: remainingCost === 0 && refundApplicable > 0,
        savingsPercentage: category.price > 0 ? (refundApplicable / category.price) * 100 : 0
      };
    });

    const totalRemainingCost = totalOriginalCost - totalRefundApplied;
    
    setCalculationResult({
      totalOriginalCost,
      totalRefundApplied,
      totalRemainingCost,
      categoryBreakdown,
      refundEfficiency: totalOriginalCost > 0 ? (totalRefundApplied / totalOriginalCost) * 100 : 0,
      isFullyCovered: totalRemainingCost === 0 && totalRefundApplied > 0
    });
  };

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
        setPaymentSelections(response.data.data.paymentSelections);
        setShowPaymentSummary(true);
      }
    } catch (error) {
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

  const handlePayment = async (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    
    try {
      setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'processing' }));
      
      const response = await axios.post(
        'http://localhost:5000/api/web-advertise/payment/initiate-with-refund',
        {
          adId: adId,
          websiteId: selection.websiteId,
          categoryId: selection.categoryId
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        if (response.data.paymentMethod === 'refund_only') {
          // Refund-only payment completed
          setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'success' }));
          setSuccessfulPayments(prev => [...prev, {
            ...selection,
            refundApplied: response.data.refundUsed,
            paymentMethod: 'refund_only'
          }]);
          
          // Update refund info after successful refund-only payment
          fetchRefundInfo();
          
          // Show success message
          alert(`Payment completed using refund credits! ($${response.data.refundUsed} used)`);
        } else {
          // External payment needed - redirect to Flutterwave
          console.log('Redirecting to Flutterwave:', response.data.paymentUrl);
          
          // Reset processing status before redirect
          setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'pending' }));
          
          // Redirect to Flutterwave payment page
          window.location.href = response.data.paymentUrl;
        }
      } else {
        setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'failed' }));
        alert('Payment initiation failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      
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
    
    // Get the correct refund info for this specific category
    const categoryRefundInfo = getCategoryRefundInfo(selection.categoryId);
    
    switch (status) {
      case 'processing': return 'Processing...';
      case 'success': return 'Completed ✓';
      case 'fully_booked': return 'Fully Booked';
      case 'failed': return 'Retry Payment';
      default: 
        // FIXED: Use the category-specific refund calculation
        if (categoryRefundInfo.remainingCost === 0 && categoryRefundInfo.refundApplicable > 0) {
          return `Use Refund Credits ($${categoryRefundInfo.refundApplicable.toFixed(2)})`;
        }
        // Mixed payment (partial refund + external payment)
        else if (categoryRefundInfo.refundApplicable > 0 && categoryRefundInfo.remainingCost > 0) {
          return `Pay $${categoryRefundInfo.remainingCost.toFixed(2)} (Refund: $${categoryRefundInfo.refundApplicable.toFixed(2)})`;
        }
        // Full external payment
        else {
          return `Pay $${selection.price.toFixed(2)}`;
        }
    }
  };

  const allPaymentsComplete = () => {
    return paymentSelections.every(selection => {
      const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
      return paymentStatus[selectionKey] === 'success';
    });
  };

  // ENHANCED: Get refund breakdown for a specific category
  const getCategoryRefundInfo = (categoryId) => {
    const categoryInfo = calculationResult.categoryBreakdown.find(cat => cat.categoryId === categoryId);
    if (!categoryInfo) {
      return {
        refundApplicable: 0,
        remainingCost: 0,
        isFullyCovered: false,
        savingsPercentage: 0
      };
    }
    return categoryInfo;
  };

  // Payment Summary Modal
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

          {/* ENHANCED: Smart Refund Summary */}
          {calculationResult.totalRefundApplied > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">Smart Refund Applied!</div>
                  <div className="text-sm text-green-700">
                    Optimized refund distribution across {paymentSelections.length} selection{paymentSelections.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-green-600">Refund Savings</div>
                  <div className="font-bold text-green-800">${calculationResult.totalRefundApplied.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-green-600">Coverage</div>
                  <div className="font-bold text-green-800">{calculationResult.refundEfficiency.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-green-600">You Pay</div>
                  <div className="font-bold text-green-800">${calculationResult.totalRemainingCost.toFixed(2)}</div>
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
                      
                      {/* ENHANCED: Clear refund breakdown */}
                      {selection.availableRefund > 0 && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700 text-sm">
                            <Calculator className="w-4 h-4" />
                            <span>Refund Calculation</span>
                          </div>
                          <div className="mt-1 text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Original price:</span>
                              <span>${selection.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>Refund applied:</span>
                              <span>-${selection.availableRefund.toFixed(2)}</span>
                            </div>
                            <hr className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Amount to pay:</span>
                              <span>${selection.remainingCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status indicators */}
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
                        className={`px-6 py-2 rounded-lg font-medium transition-colors min-w-[200px] ${
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

          {/* ENHANCED: Comprehensive Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Total Original Cost:</span>
                <span>${calculationResult.totalOriginalCost.toFixed(2)}</span>
              </div>
              {calculationResult.totalRefundApplied > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Refund Credits Applied:</span>
                    <span>-${calculationResult.totalRefundApplied.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Refund Efficiency:</span>
                    <span>{calculationResult.refundEfficiency.toFixed(1)}% covered</span>
                  </div>
                </>
              )}
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Final Amount to Pay:</span>
                <span className={calculationResult.totalRemainingCost === 0 ? 'text-green-600' : 'text-gray-900'}>
                  ${calculationResult.totalRemainingCost.toFixed(2)}
                </span>
              </div>
              {calculationResult.isFullyCovered && (
                <div className="text-center text-green-600 font-medium mt-3 p-3 bg-green-50 rounded-lg">
                  🎉 Fully covered by refund credits! No payment required.
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
                      Smart refund system will automatically optimize your savings
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
                        const refundInfo = getCategoryRefundInfo(category._id);
                        
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
                                
                                {/* ENHANCED: Smart price display with refund calculation */}
                                <div className="mt-2">
                                  <div className="text-lg font-bold text-gray-900">
                                    ${category.price.toFixed(2)}
                                  </div>
                                  
                                  {isSelected && refundInfo.refundApplicable > 0 && !isFullyBooked && (
                                    <div className="mt-1 p-2 bg-green-50 rounded text-xs">
                                      <div className="text-green-600">
                                        Refund: -${refundInfo.refundApplicable.toFixed(2)}
                                      </div>
                                      <div className="font-medium text-green-800">
                                        You pay: ${refundInfo.remainingCost.toFixed(2)}
                                      </div>
                                      {refundInfo.savingsPercentage > 0 && (
                                        <div className="text-green-600">
                                          {refundInfo.savingsPercentage.toFixed(0)}% savings
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {isSelected && refundInfo.isFullyCovered && !isFullyBooked && (
                                    <div className="mt-1 text-sm font-medium text-green-600">
                                      ✨ Fully covered by refunds!
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

            {/* ENHANCED: Smart calculation summary footer */}
            {selectedCategories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky bottom-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
                    </div>
                    
                    {/* ENHANCED: Detailed cost breakdown */}
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <div>
                        Original total: ${calculationResult.totalOriginalCost.toFixed(2)}
                        {calculationResult.totalRefundApplied > 0 && (
                          <>
                            {' • '}
                            <span className="text-green-600">
                              ${calculationResult.totalRefundApplied.toFixed(2)} refund savings ({calculationResult.refundEfficiency.toFixed(0)}% coverage)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {calculationResult.totalRemainingCost !== calculationResult.totalOriginalCost && (
                      <div className="text-lg font-bold text-blue-600 mt-1">
                        Final amount to pay: ${calculationResult.totalRemainingCost.toFixed(2)}
                      </div>
                    )}
                    
                    {calculationResult.isFullyCovered && (
                      <div className="text-lg font-bold text-green-600 mt-1">
                        🎉 Fully covered by refunds - No payment needed!
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleAddSelections}
                    disabled={isSubmitting || selectedCategories.length === 0}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Processing...' : 
                     calculationResult.isFullyCovered ? 'Proceed (Free)' : 
                     `Proceed to Payment`}
                  </button>
                </div>

                {/* ENHANCED: Quick refund breakdown preview */}
                {calculationResult.totalRefundApplied > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <Calculator className="w-4 h-4" />
                      Smart Refund Preview
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600">Original</div>
                        <div className="font-medium">${calculationResult.totalOriginalCost.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-green-600">Refund</div>
                        <div className="font-medium text-green-600">-${calculationResult.totalRefundApplied.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-blue-600">You Pay</div>
                        <div className="font-medium text-blue-600">${calculationResult.totalRemainingCost.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SelectCategoriesForExistingAd;