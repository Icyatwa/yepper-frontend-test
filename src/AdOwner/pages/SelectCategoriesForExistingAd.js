// SelectCategoriesForExistingAd.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [walletInfo, setWalletInfo] = useState({ balance: 0, hasWallet: false });
  
  const [paymentBreakdown, setPaymentBreakdown] = useState({
    totalCost: 0,
    walletBalance: 0,
    availableRefunds: 0,
    paidFromWallet: 0,
    paidFromRefunds: 0,
    needsExternalPayment: 0,
    canAffordAll: false,
    isReassignment: false,
    paymentRestrictions: ''
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
    fetchWalletInfo();
  }, [adId, selectedWebsites]);

  useEffect(() => {
    if (showPaymentSummary && paymentSelections.length > 0) {
      calculatePaymentBreakdown();
    }
  }, [showPaymentSummary, paymentSelections]);

  const fetchWalletInfo = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/web-advertise/payment/wallet-balance',
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        setWalletInfo({
          balance: response.data.walletBalance || 0,
          hasWallet: response.data.hasWallet || false
        });
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      setWalletInfo({ balance: 0, hasWallet: false });
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

  const calculatePaymentBreakdown = async () => {
    try {
      const selections = paymentSelections.map(selection => ({
        adId: adId,
        websiteId: selection.websiteId,
        categoryId: selection.categoryId
      }));

      console.log('Calculating payment breakdown for:', selections);
      console.log('Is Reassignment:', isReassignment);

      const response = await axios.post(
        'http://localhost:5000/api/web-advertise/payment/calculate-breakdown',
        { 
          selections,
          isReassignment: isReassignment || false // Pass reassignment flag
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setPaymentBreakdown(response.data.summary);
        console.log('Payment breakdown:', response.data.summary);
      }
    } catch (error) {
      console.error('Error calculating payment breakdown:', error);
    }
  };

  const buildPaymentSelections = () => {
    const selections = [];
    
    selectedCategories.forEach(categoryId => {
      for (const website of categoriesByWebsite) {
        const category = website.categories.find(cat => cat._id === categoryId);
        
        if (category) {
          const selection = {
            websiteId: website.websiteId,
            categoryId: categoryId,
            price: parseFloat(category.price) || 0,
            categoryName: category.categoryName || 'Unknown Category',
            websiteName: website.websiteName || 'Unknown Website'
          };
          
          selections.push(selection);
          break;
        }
      }
    });
    
    return selections;
  };

  const handleAddSelections = async () => {
    if (selectedCategories.length === 0) return;

    setIsSubmitting(true);

    try {
      const builtSelections = buildPaymentSelections();
      
      if (builtSelections.length === 0) {
        alert('No valid categories found. Please refresh and try again.');
        setIsSubmitting(false);
        return;
      }

      // Validate with backend
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
        setPaymentSelections(builtSelections);
        setShowPaymentSummary(true);
      }
    } catch (error) {
      console.error('Error in handleAddSelections:', error);
      alert('Error adding website selections: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayAllCategories = async () => {
    try {
      setIsSubmitting(true);
      
      const selections = paymentSelections.map(selection => ({
        adId: adId,
        websiteId: selection.websiteId,
        categoryId: selection.categoryId
      }));

      console.log('Sending payment request with selections:', selections);

      const response = await axios.post(
        'http://localhost:5000/api/web-advertise/payment/process-wallet',
        { 
          selections,
          isReassignment: isReassignment || false 
        },
        { headers: getAuthHeaders() }
      );

      console.log('Payment response:', response.data);

      if (response.data.success) {
        if (response.data.allPaid) {
          // Full payment completed via wallet
          const message = response.data.summary?.message || response.data.message || 'Payment completed successfully!';
          alert(message);
          navigate('/my-ads');
        } else {
          // Partial payment - redirect to external payment
          const message = response.data.summary?.message || response.data.message || 'Redirecting to complete payment...';
          alert(message);
          
          if (response.data.paymentUrl) {
            console.log('Redirecting to payment URL:', response.data.paymentUrl);
            window.location.href = response.data.paymentUrl;
          } else {
            throw new Error('Payment URL not provided');
          }
        }
      } else {
        throw new Error(response.data.error || response.data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Payment failed';
      
      if (error.response?.data) {
        // Server responded with error
        errorMessage = error.response.data.error || error.response.data.message || 'Server error occurred';
      } else if (error.message) {
        // Other errors (network, etc.)
        errorMessage = error.message;
      }
      
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentButtonText = () => {
    const { totalCost, paidFromWallet, paidFromRefunds, needsExternalPayment, isReassignment } = paymentBreakdown;
    
    if (needsExternalPayment === 0) {
      let text = 'Complete All Payments';
      let parts = [];
      
      if (paidFromWallet > 0) {
        parts.push(`$${paidFromWallet.toFixed(2)} from wallet`);
      }
      
      // Only show refund info for non-reassignment
      if (paidFromRefunds > 0 && !isReassignment) {
        parts.push(`$${paidFromRefunds.toFixed(2)} from refunds`);
      }
      
      if (parts.length > 0) {
        text += ` (${parts.join(', ')})`;
      }
      
      return text;
    } else {
      let parts = [];
      
      if (paidFromWallet > 0) {
        parts.push(`$${paidFromWallet.toFixed(2)} from wallet`);
      }
      
      // Only show refund info for non-reassignment
      if (paidFromRefunds > 0 && !isReassignment) {
        parts.push(`$${paidFromRefunds.toFixed(2)} from refunds`);
      }
      
      let text = `Pay $${needsExternalPayment.toFixed(2)} with Card`;
      if (parts.length > 0) {
        text += ` (${parts.join(', ')} applied)`;
      }
      
      if (isReassignment) {
        text += ' - Reassignment';
      }
      
      return text;
    }
  };

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const calculateTotalCost = () => {
    return selectedCategories.reduce((total, categoryId) => {
      for (const website of categoriesByWebsite) {
        const category = website.categories.find(cat => cat._id === categoryId);
        if (category) {
          return total + (parseFloat(category.price) || 0);
        }
      }
      return total;
    }, 0);
  };

  // Payment Summary Modal
  if (showPaymentSummary) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">
              Payment Summary {isReassignment && <span className="text-orange-600">(Ad Reassignment)</span>}
            </h2>

            {/* Reassignment Warning */}
            {isReassignment && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-600 font-semibold">⚠️ Reassignment Payment</span>
                </div>
                <p className="text-sm text-orange-700">
                  For ad reassignments, you can only use your wallet balance or card payment. 
                  Refund credits cannot be applied to reassignment payments.
                </p>
              </div>
            )}

            {/* Payment Breakdown */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Payment Breakdown</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-semibold">${paymentBreakdown.totalCost?.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Your Wallet Balance:</span>
                  <span className="text-green-600">${paymentBreakdown.walletBalance?.toFixed(2)}</span>
                </div>
                
                {!isReassignment && (
                  <div className="flex justify-between">
                    <span>Available Refund Credits:</span>
                    <span className="text-blue-600">${paymentBreakdown.availableRefunds?.toFixed(2)}</span>
                  </div>
                )}
                
                {isReassignment && (
                  <div className="flex justify-between text-gray-500">
                    <span>Refund Credits:</span>
                    <span>Not available for reassignment</span>
                  </div>
                )}
                
                <div className="border-t pt-2 mt-2">
                  {paymentBreakdown.paidFromWallet > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Paid from Wallet:</span>
                      <span>-${paymentBreakdown.paidFromWallet?.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {paymentBreakdown.paidFromRefunds > 0 && !isReassignment && (
                    <div className="flex justify-between text-blue-600">
                      <span>Paid from Refunds:</span>
                      <span>-${paymentBreakdown.paidFromRefunds?.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>
                      {paymentBreakdown.needsExternalPayment > 0 ? 'Remaining to Pay:' : 'Total Paid:'}
                    </span>
                    <span>
                      {paymentBreakdown.needsExternalPayment > 0 
                        ? `$${paymentBreakdown.needsExternalPayment?.toFixed(2)}`
                        : `$${paymentBreakdown.totalCost?.toFixed(2)}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Restrictions Info */}
              {paymentBreakdown.paymentRestrictions && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>Payment Info:</strong> {paymentBreakdown.paymentRestrictions}
                </div>
              )}
            </div>

            {/* Selected Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Selected Categories</h3>
              <div className="space-y-2">
                {paymentSelections.map((selection, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{selection.categoryName}</div>
                      <div className="text-sm text-gray-600">{selection.websiteName}</div>
                    </div>
                    <div className="font-semibold">${selection.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Balance Info */}
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Wallet Balance:</span>
                <span className="font-bold text-green-600">${walletInfo.balance?.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {isReassignment 
                  ? 'Reassignments can use wallet balance + card payment only'
                  : 'New ads can use wallet balance, refunds, or card payment'
                }
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentSummary(false)}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Back
              </button>
              
              <button
                onClick={handlePayAllCategories}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 font-medium"
              >
                {isSubmitting ? 'Processing...' : getPaymentButtonText()}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main category selection UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Select Categories for {ad?.businessName}
            </h1>
            
            {isReassignment && (
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-orange-700">Reassignment</span>
              </div>
            )}
          </div>

          {/* Payment Method Notice for Reassignment */}
          {isReassignment && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">ℹ️</span>
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Reassignment Payment Notice</h3>
                  <p className="text-sm text-yellow-700">
                    This is an ad reassignment. You can only pay using:
                  </p>
                  <ul className="text-sm text-yellow-700 mt-1 ml-4">
                    <li>• Your wallet balance (${walletInfo.balance?.toFixed(2)} available)</li>
                    <li>• Card payment via Flutterwave</li>
                  </ul>
                  <p className="text-sm text-yellow-700 mt-1 font-medium">
                    Refund credits cannot be used for reassignments.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <>
              {/* Categories Display */}
              {categoriesByWebsite.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No categories available for the selected websites.
                </div>
              ) : (
                <div className="space-y-6">
                  {categoriesByWebsite.map((website) => (
                    <div key={website.websiteId} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span>{website.websiteName}</span>
                        <a 
                          href={website.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Visit ↗
                        </a>
                      </h3>
                      
                      {website.categories.length === 0 ? (
                        <p className="text-gray-500">No categories available</p>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {website.categories.map((category) => (
                            <div 
                              key={category._id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedCategories.includes(category._id)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleCategorySelection(category._id)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{category.categoryName}</h4>
                                <span className="text-lg font-bold text-green-600">
                                  ${category.price}
                                </span>
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                Slots: {category.selectedAds?.length || 0}/{category.userCount || 10}
                              </div>
                              
                              {selectedCategories.includes(category._id) && (
                                <div className="mt-2 text-xs text-blue-600 font-medium">
                                  ✓ Selected
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Selection Summary and Action */}
              {selectedCategories.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedCategories.length} Categories Selected
                      </h3>
                      <p className="text-sm text-gray-600">
                        Total Cost: <span className="font-bold text-green-600">${calculateTotalCost().toFixed(2)}</span>
                      </p>
                    </div>
                    
                    <button
                      onClick={handleAddSelections}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 font-medium"
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </div>

                  {/* Selected Categories List */}
                  <div className="text-sm text-gray-600">
                    <strong>Selected:</strong>{' '}
                    {selectedCategories.map(categoryId => {
                      for (const website of categoriesByWebsite) {
                        const category = website.categories.find(cat => cat._id === categoryId);
                        if (category) {
                          return `${category.categoryName} (${website.websiteName})`;
                        }
                      }
                      return 'Unknown Category';
                    }).join(', ')}
                  </div>
                </div>
              )}

              {/* Back to My Ads */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/my-ads')}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Back to My Ads
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectCategoriesForExistingAd;