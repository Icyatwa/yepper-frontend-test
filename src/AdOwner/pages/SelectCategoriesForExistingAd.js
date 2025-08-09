import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, DollarSign, Globe, CreditCard, CheckCircle, AlertCircle, RefreshCw, Wallet, TrendingUp, Calculator } from 'lucide-react';

// SelectCategoriesForExistingAd.js
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
  
  const [refundInfo, setRefundInfo] = useState({
    totalAvailable: 0,
    details: []
  });

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
    if (showPaymentSummary && paymentSelections.length > 0 && refundInfo.totalAvailable !== undefined) {
      calculateSmartRefundDistribution();
    }
  }, [showPaymentSummary, paymentSelections, refundInfo.totalAvailable]);

  const fetchRefundInfo = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/web-advertise/payment/refund-balance',
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        setRefundInfo({
          totalAvailable: response.data.totalAvailableRefunds || 0,
          details: response.data.refundDetails || []
        });
      }
    } catch (error) {
      console.error('Error fetching refund info:', error);
      setRefundInfo({ totalAvailable: 0, details: [] });
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const promises = selectedWebsites.map(async (websiteId) => {
        try {
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
        } catch (error) {
          console.error(`Error fetching data for website ${websiteId}:`, error);
          return {
            websiteId: websiteId,
            websiteName: 'Unknown Website',
            websiteLink: '#',
            categories: [],
          };
        }
      });
      
      const result = await Promise.all(promises);
      setCategoriesByWebsite(result.filter(Boolean));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Build payment selections from actual category data
  const buildPaymentSelections = () => {
    console.log('=== BUILDING PAYMENT SELECTIONS ===');
    console.log('selectedCategories:', selectedCategories);
    console.log('categoriesByWebsite:', categoriesByWebsite);
    
    const selections = [];
    
    selectedCategories.forEach(categoryId => {
      console.log(`Looking for categoryId: ${categoryId}`);
      
      // Find the category in categoriesByWebsite
      let found = false;
      for (const website of categoriesByWebsite) {
        console.log(`Checking website: ${website.websiteName} with ${website.categories.length} categories`);
        
        const category = website.categories.find(cat => {
          console.log(`Comparing cat._id (${cat._id}) with categoryId (${categoryId})`);
          return cat._id === categoryId;
        });
        
        if (category) {
          console.log(`Found category:`, category);
          const selection = {
            websiteId: website.websiteId,
            categoryId: categoryId,
            price: parseFloat(category.price) || 0,
            categoryName: category.categoryName || 'Unknown Category',
            websiteName: website.websiteName || 'Unknown Website',
            userCount: category.userCount || 10,
            currentAdsCount: category.selectedAds ? category.selectedAds.length : 0
          };
          
          console.log(`Created selection:`, selection);
          selections.push(selection);
          found = true;
          break; // Found the category, move to next categoryId
        }
      }
      
      if (!found) {
        console.error(`Category ${categoryId} not found in any website!`);
      }
    });
    
    console.log('Final selections:', selections);
    return selections;
  };

  const handleAddSelections = async () => {
    if (selectedCategories.length === 0) return;

    setIsSubmitting(true);

    try {
      // Build selections from local data instead of relying on backend
      const builtSelections = buildPaymentSelections();
      
      console.log('Built selections count:', builtSelections.length);
      console.log('Selected categories count:', selectedCategories.length);
      
      if (builtSelections.length === 0) {
        console.error('No built selections created!');
        alert('No valid categories found. Please refresh and try again.');
        setIsSubmitting(false);
        return;
      }
      
      // Check for invalid selections
      const invalidSelections = builtSelections.filter(sel => !sel.price || sel.price <= 0);
      if (invalidSelections.length > 0) {
        console.error('Invalid selections found:', invalidSelections);
        invalidSelections.forEach((sel, index) => {
          console.error(`Invalid price for selection ${index}:`, sel);
        });
        alert('Some categories have invalid prices. Please refresh and try again.');
        setIsSubmitting(false);
        return;
      }

      // Still call backend to validate and create selections
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
        // Use built selections with fallback to response data
        const finalSelections = builtSelections.map(built => {
          const fromResponse = response.data.data.paymentSelections?.find(
            sel => sel.categoryId === built.categoryId && sel.websiteId === built.websiteId
          );
          
          return {
            ...built,
            // Override with response data if available and valid
            price: (fromResponse?.price && parseFloat(fromResponse.price) > 0) 
              ? parseFloat(fromResponse.price) 
              : built.price,
            categoryName: fromResponse?.categoryName || built.categoryName,
            websiteName: fromResponse?.websiteName || built.websiteName
          };
        });
        
        console.log('FINAL SELECTIONS:', finalSelections);
        setPaymentSelections(finalSelections);
        setShowPaymentSummary(true);
      }
    } catch (error) {
      console.error('Error in handleAddSelections:', error);
      if (error.response?.status === 409 && error.response?.data?.fullyBookedCategories) {
        setFullyBookedCategories(error.response.data.fullyBookedCategories);
        alert(`Some categories are fully booked!`);
      } else {
        alert('Error adding website selections: ' + (error.response?.data?.error || 'Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSmartRefundDistribution = () => {
    if (!paymentSelections || paymentSelections.length === 0) {
      setCalculationResult({
        totalOriginalCost: 0,
        totalRefundApplied: 0,
        totalRemainingCost: 0,
        categoryBreakdown: [],
        refundEfficiency: 0,
        isFullyCovered: false
      });
      return;
    }

    const validSelections = paymentSelections.filter(selection => 
      selection && typeof selection.price === 'number' && selection.price > 0
    );

    if (validSelections.length === 0) {
      setCalculationResult({
        totalOriginalCost: 0,
        totalRefundApplied: 0,
        totalRemainingCost: 0,
        categoryBreakdown: [],
        refundEfficiency: 0,
        isFullyCovered: false
      });
      return;
    }

    const totalOriginalCost = validSelections.reduce((sum, selection) => sum + selection.price, 0);
    const availableRefunds = parseFloat(refundInfo.totalAvailable) || 0;
    const totalRefundToApply = Math.min(availableRefunds, totalOriginalCost);
    
    const categoryBreakdown = validSelections.map(selection => {
      const categoryProportion = selection.price / totalOriginalCost;
      const refundApplicable = totalRefundToApply * categoryProportion;
      const remainingCost = Math.max(0, selection.price - refundApplicable);
      
      return {
        categoryId: selection.categoryId,
        websiteId: selection.websiteId,
        websiteName: selection.websiteName,
        categoryName: selection.categoryName,
        price: selection.price,
        refundApplicable: refundApplicable,
        remainingCost: remainingCost,
        isFullyCovered: remainingCost <= 0.01 && refundApplicable > 0,
        savingsPercentage: selection.price > 0 ? (refundApplicable / selection.price) * 100 : 0
      };
    });

    const totalRefundApplied = categoryBreakdown.reduce((sum, cat) => sum + cat.refundApplicable, 0);
    const totalRemainingCost = totalOriginalCost - totalRefundApplied;
    
    const result = {
      totalOriginalCost,
      totalRefundApplied,
      totalRemainingCost,
      categoryBreakdown,
      refundEfficiency: totalOriginalCost > 0 ? (totalRefundApplied / totalOriginalCost) * 100 : 0,
      isFullyCovered: totalRemainingCost <= 0.01 && totalRefundApplied > 0
    };
    
    setCalculationResult(result);
  };

  const getCategoryRefundInfo = (categoryId) => {
    const categoryInfo = calculationResult.categoryBreakdown.find(cat => cat.categoryId === categoryId);
    
    if (!categoryInfo) {
      const selection = paymentSelections.find(sel => sel.categoryId === categoryId);
      if (!selection || selection.price <= 0) {
        return {
          refundApplicable: 0,
          remainingCost: 0,
          isFullyCovered: false,
          savingsPercentage: 0
        };
      }
      
      const totalCost = paymentSelections.reduce((sum, sel) => sum + (sel.price || 0), 0);
      if (totalCost <= 0) {
        return {
          refundApplicable: 0,
          remainingCost: selection.price,
          isFullyCovered: false,
          savingsPercentage: 0
        };
      }
      
      const proportion = selection.price / totalCost;
      const refundApplicable = Math.min((refundInfo.totalAvailable || 0) * proportion, selection.price);
      const remainingCost = selection.price - refundApplicable;
      
      return {
        refundApplicable,
        remainingCost,
        isFullyCovered: remainingCost <= 0.01 && refundApplicable > 0,
        savingsPercentage: selection.price > 0 ? (refundApplicable / selection.price) * 100 : 0
      };
    }
    
    return categoryInfo;
  };

  const getPaymentButtonText = (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    const status = paymentStatus[selectionKey];
    
    const categoryRefundInfo = getCategoryRefundInfo(selection.categoryId);
    
    switch (status) {
      case 'processing': return 'Processing...';
      case 'success': return 'Completed ✓';
      case 'fully_booked': return 'Fully Booked';
      case 'failed': return 'Retry Payment';
      default: 
        const { refundApplicable, remainingCost } = categoryRefundInfo;
        
        if (remainingCost <= 0.01 && refundApplicable > 0) {
          return `Use Refund ($${refundApplicable.toFixed(2)})`;
        } else if (refundApplicable > 0 && remainingCost > 0) {
          return `Pay $${remainingCost.toFixed(2)}`;
        } else {
          return `Pay $${(selection.price || 0).toFixed(2)}`;
        }
    }
  };

  const handlePayment = async (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    
    try {
      setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'processing' }));
      
      const pendingCategories = paymentSelections.filter(sel => {
        const key = `${sel.websiteId}_${sel.categoryId}`;
        return paymentStatus[key] !== 'success';
      });
      
      const response = await axios.post(
        'http://localhost:5000/api/web-advertise/payment/initiate-with-refund',
        {
          adId: adId,
          websiteId: selection.websiteId,
          categoryId: selection.categoryId,
          pendingCategoriesCount: pendingCategories.length
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        if (response.data.paymentMethod === 'refund_only') {
          setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'success' }));
          setSuccessfulPayments(prev => [...prev, {
            ...selection,
            refundApplied: response.data.refundUsed,
            paymentMethod: 'refund_only'
          }]);
          
          fetchRefundInfo();
          setTimeout(() => {
            calculateSmartRefundDistribution();
          }, 100);
          
          alert(`Payment completed using refund credits! ($${response.data.refundUsed.toFixed(2)} used)`);
        } else {
          setPaymentStatus(prev => ({ ...prev, [selectionKey]: 'pending' }));
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

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isPaymentDisabled = (selection) => {
    const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
    const status = paymentStatus[selectionKey];
    return status === 'processing' || status === 'success' || status === 'fully_booked';
  };

  const allPaymentsComplete = () => {
    return paymentSelections.every(selection => {
      const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
      return paymentStatus[selectionKey] === 'success';
    });
  };

  // Payment Summary Modal
  if (showPaymentSummary) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>
            
            {/* Refund Summary */}
            {refundInfo.totalAvailable > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Available Refund Credits</h3>
                <p className="text-green-700">
                  You have <span className="font-bold">${refundInfo.totalAvailable.toFixed(2)}</span> in refund credits available
                </p>
                {calculationResult.refundEfficiency > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    {calculationResult.refundEfficiency.toFixed(1)}% of your total cost will be covered by refunds
                  </p>
                )}
              </div>
            )}

            {/* Payment Selections */}
            <div className="space-y-4">
              {paymentSelections.map((selection, index) => {
                const categoryRefundInfo = getCategoryRefundInfo(selection.categoryId);
                const selectionKey = `${selection.websiteId}_${selection.categoryId}`;
                const status = paymentStatus[selectionKey];

                return (
                  <div key={`${selection.websiteId}_${selection.categoryId}`} 
                       className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{selection.categoryName}</h4>
                        <p className="text-sm text-gray-600">Website: {selection.websiteName}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          Original Price: ${(selection.price || 0).toFixed(2)}
                        </p>
                      </div>
                      
                      {categoryRefundInfo.refundApplicable > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-green-600">
                            Refund Applied: -${categoryRefundInfo.refundApplicable.toFixed(2)}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            You Pay: ${categoryRefundInfo.remainingCost.toFixed(2)}
                          </p>
                          {categoryRefundInfo.savingsPercentage > 0 && (
                            <p className="text-xs text-green-500">
                              {categoryRefundInfo.savingsPercentage.toFixed(1)}% savings
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handlePayment(selection)}
                      disabled={isPaymentDisabled(selection)}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        status === 'success' 
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : status === 'processing'
                          ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                          : status === 'fully_booked'
                          ? 'bg-red-100 text-red-800 cursor-not-allowed'
                          : categoryRefundInfo.isFullyCovered
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {getPaymentButtonText(selection)}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary Totals */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Original Cost:</span>
                <span className="font-bold text-lg">${calculationResult.totalOriginalCost.toFixed(2)}</span>
              </div>
              {calculationResult.totalRefundApplied > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Total Refund Applied:</span>
                  <span>-${calculationResult.totalRefundApplied.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="font-bold text-lg">Total You Pay:</span>
                <span className="font-bold text-xl text-blue-600">
                  ${calculationResult.totalRemainingCost.toFixed(2)}
                </span>
              </div>
            </div>

            {allPaymentsComplete() && (
              <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
                <p className="text-green-800 font-semibold">
                  All payments completed successfully! Your ads are now active.
                </p>
                <button
                  onClick={() => navigate('/my-ads')}
                  className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  View My Ads
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main category selection UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Select Categories for Your Ad
          </h1>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {categoriesByWebsite.map((website) => (
                <div key={website.websiteId} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {website.websiteName}
                  </h3>
                  
                  {website.categories.length === 0 ? (
                    <p className="text-gray-500">No categories available for this website</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {website.categories.map((category) => (
                        <div key={category._id} 
                             className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                               selectedCategories.includes(category._id)
                                 ? 'border-blue-500 bg-blue-50'
                                 : 'border-gray-200 hover:border-gray-300'
                             }`}
                             onClick={() => handleCategorySelection(category._id)}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{category.categoryName}</h4>
                              <p className="text-sm text-gray-600">${(category.price || 0).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">
                                {category.selectedAds?.length || 0}/{category.userCount || 10} slots
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category._id)}
                              onChange={() => handleCategorySelection(category._id)}
                              className="h-4 w-4 text-blue-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {selectedCategories.length > 0 && (
                <div className="flex justify-between items-center pt-6 border-t">
                  <p className="text-gray-600">
                    {selectedCategories.length} categories selected
                  </p>
                  <button
                    onClick={handleAddSelections}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectCategoriesForExistingAd;