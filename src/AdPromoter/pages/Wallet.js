// Wallet.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, DollarSign, Eye, Loader, CheckCircle, Clock } from 'lucide-react';
import { Button, Grid, Badge, Input, Select } from '../../components/components';
import { useAuth } from '../../context/AuthContext';

const WalletComponent = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(null);
    const [detailedBalance, setDetailedBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [withdrawals, setWithdrawals] = useState({});
    const [eligibilityStates, setEligibilityStates] = useState({});  
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});

    useEffect(() => {
      console.log('User object:', user);
      console.log('Auth loading:', authLoading);
    }, [user, authLoading]);

    useEffect(() => {
      // Wait for auth to finish loading and user to be available
      if (!authLoading && user) {
        fetchBalance();
        fetchDetailedBalance();
      } else if (!authLoading && !user) {
        setError('Please log in to view your wallet');
        setLoading(false);
      }
    }, [user, authLoading]);
  
    useEffect(() => {
        fetchDetailedBalance();
    }, [user?.id]);

    const getAuthHeaders = () => {
        const token = user?.token || user?.accessToken || localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (!token) {
            console.warn('No authentication token found');
            return {};
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const getUserId = () => {
      // Try different possible user ID properties
      return user?.id || user?.userId || user?._id || user?.uid;
    };

    const fetchBalance = async () => {
      const userId = getUserId();
      
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const headers = getAuthHeaders();
        console.log('Sending request with headers:', headers); // Debug log
        
        const response = await fetch(`http://localhost:5000/api/ad-categories/balance/${userId}`, {
          method: 'GET',
          headers: headers
        });
        
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Optionally redirect to login or refresh token
          return;
        }
        
        if (response.status === 404) {
          setBalance({
            availableBalance: 0,
            totalEarnings: 0
          });
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch balance: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBalance(data);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Unable to fetch wallet balance. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchDetailedBalance = async () => {
      const userId = getUserId();
      
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const headers = getAuthHeaders();
        console.log('Sending detailed earnings request with headers:', headers); // Debug log
        
        const response = await fetch(`http://localhost:5000/api/ad-categories/earnings/${userId}`, {
          method: 'GET',
          headers: headers
        });
        
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch earnings: ${response.statusText}`);
        }
        
        const data = await response.json();

        const processedData = {
          ...data,
          monthlyEarnings: data.monthlyEarnings.map(month => ({
            ...month,
            payments: month.payments.map(payment => ({
              ...payment,
              _id: payment._id || payment.paymentReference
            }))
          }))
        };
        
        // Group payments by business
        const groupedByBusiness = processedData.monthlyEarnings.reduce((acc, month) => {
          month.payments.forEach(payment => {
            if (!acc[payment.businessName]) {
              acc[payment.businessName] = {
                totalAmount: 0,
                businessInfo: {
                  name: payment.businessName,
                  location: payment.businessLocation,
                  link: payment.businessLink,
                  email: payment.advertiserEmail
                },
                payments: []
              };
            }
            acc[payment.businessName].payments.push(payment);
            acc[payment.businessName].totalAmount += payment.amount;
          });
          return acc;
        }, {});

        setDetailedBalance({
          totalBalance: data.totalBalance,
          businessEarnings: groupedByBusiness
        });
      } catch (err) {
        console.error('Error fetching detailed balance:', err);
        setError('Unable to fetch detailed earnings. Please try again later.');
      }
    };

    const validateCardNumber = (cardNumber) => {
        const cleaned = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleaned);
    };

    const validateExpiryDate = (month, year) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }
        return true;
    };

    const handlePaymentMethodChange = (paymentId, method) => {
        setSelectedPaymentMethod(prev => ({
            ...prev,
            [paymentId]: method
        }));
        
        // Reset withdrawal data when payment method changes
        setWithdrawals(prev => ({
            ...prev,
            [paymentId]: {
                amount: prev[paymentId]?.amount || '',
                paymentMethod: method,
                error: null
            }
        }));
    };

    const handleWithdraw = async (businessName, paymentId, amount) => {
        const currentMethod = selectedPaymentMethod[paymentId] || 'mobile_money';
        
        setWithdrawals(prev => ({
            ...prev,
            [paymentId]: {
                businessName,
                amount: amount.toString(),
                paymentMethod: currentMethod,
                // Initialize fields based on payment method
                ...(currentMethod === 'mobile_money' && { phoneNumber: '' }),
                ...(currentMethod === 'bank_card' && { 
                    cardNumber: '',
                    cardHolderName: '',
                    expiryMonth: '',
                    expiryYear: ''
                }),
                ...(currentMethod === 'bank_transfer' && {
                    bankCode: '',
                    accountNumber: '',
                    accountName: ''
                }),
                error: null
            }
        }));
    };
  
    const handleInputChange = (paymentId, field, value) => {
        setWithdrawals(prev => ({
            ...prev,
            [paymentId]: {
                ...prev[paymentId],
                [field]: value,
                error: null
            }
        }));
    };

    const validateWithdrawalData = (withdrawalData) => {
        const { amount, paymentMethod } = withdrawalData;
        
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return 'Please enter a valid amount';
        }

        switch (paymentMethod) {
            case 'mobile_money':
                if (!withdrawalData.phoneNumber || !/^(07\d{8})$/.test(withdrawalData.phoneNumber)) {
                    return 'Please enter a valid phone number (07XXXXXXXX)';
                }
                break;
                
            case 'bank_card':
                if (!withdrawalData.cardNumber || !validateCardNumber(withdrawalData.cardNumber)) {
                    return 'Please enter a valid card number';
                }
                if (!withdrawalData.cardHolderName || withdrawalData.cardHolderName.trim().length < 2) {
                    return 'Please enter a valid cardholder name';
                }
                if (!withdrawalData.expiryMonth || !withdrawalData.expiryYear) {
                    return 'Please enter card expiry date';
                }
                if (!validateExpiryDate(withdrawalData.expiryMonth, withdrawalData.expiryYear)) {
                    return 'Card has expired or invalid expiry date';
                }
                break;
                
            case 'bank_transfer':
                if (!withdrawalData.bankCode || !withdrawalData.accountNumber || !withdrawalData.accountName) {
                    return 'Please fill in all bank details';
                }
                break;
                
            default:
                return 'Please select a valid payment method';
        }
        
        return null;
    };

    const handleWithdrawSubmit = async (paymentId) => {
        const withdrawalData = withdrawals[paymentId];
        const userId = getUserId();

        // Validate withdrawal data
        const validationError = validateWithdrawalData(withdrawalData);
        if (validationError) {
            setWithdrawals(prev => ({
                ...prev,
                [paymentId]: {
                    ...prev[paymentId],
                    error: validationError
                }
            }));
            return;
        }

        try {
            const requestData = {
                amount: parseFloat(withdrawalData.amount),
                userId: userId,
                paymentId: paymentId,
                paymentMethod: withdrawalData.paymentMethod,
                currency: withdrawalData.paymentMethod === 'mobile_money' ? 'RWF' : 'USD'
            };

            // Add payment method specific data
            switch (withdrawalData.paymentMethod) {
                case 'mobile_money':
                    requestData.phoneNumber = withdrawalData.phoneNumber;
                    break;
                case 'bank_card':
                    requestData.cardNumber = withdrawalData.cardNumber;
                    requestData.cardHolderName = withdrawalData.cardHolderName;
                    requestData.expiryMonth = withdrawalData.expiryMonth;
                    requestData.expiryYear = withdrawalData.expiryYear;
                    break;
                case 'bank_transfer':
                    requestData.bankCode = withdrawalData.bankCode;
                    requestData.accountNumber = withdrawalData.accountNumber;
                    requestData.accountName = withdrawalData.accountName;
                    break;
            }

            console.log('Sending withdrawal request:', requestData);

            // TRY AUTOMATIC FIRST, FALL BACK TO MANUAL
            let response;
            let isManual = false;
            
            try {
                // Try automatic withdrawal first
                response = await fetch("http://localhost:5000/api/ad-categories/withdraw", {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(requestData),
                });
                
                const data = await response.json();
                
                // If it's an IP whitelist error, automatically try manual
                if (!response.ok && data.error && data.error.includes('IP Whitelisting')) {
                    console.log('🔄 IP issue detected, switching to manual withdrawal...');
                    throw new Error('IP_WHITELIST_ERROR');
                }
                
            } catch (err) {
                if (err.message === 'IP_WHITELIST_ERROR' || err.message.includes('IP Whitelisting')) {
                    console.log('🔄 Switching to manual withdrawal due to IP issues...');
                    
                    // Try manual withdrawal
                    response = await fetch("http://localhost:5000/api/ad-categories/withdraw-manual", {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(requestData),
                    });
                    isManual = true;
                } else {
                    throw err;
                }
            }

            const data = await response.json();
            console.log('Withdrawal response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to process withdrawal');
            }

            // Success - clear the withdrawal form
            setWithdrawals(prev => ({
                ...prev,
                [paymentId]: undefined
            }));
            
            // Refresh balance
            fetchDetailedBalance();
            
            if (isManual) {
                alert(`Manual withdrawal request submitted successfully! 
        Reference: ${data.reference}
        Processing time: ${data.estimated_processing_time}
        Status: ${data.status}`);
            } else {
                alert(`Withdrawal initiated successfully! Reference: ${data.reference}`);
            }
            
        } catch (err) {
            console.error('Withdrawal error:', err);
            setWithdrawals(prev => ({
                ...prev,
                [paymentId]: {
                    ...prev[paymentId],
                    error: err.message
                }
            }));
        }
    };

    const validatePaymentData = (payment) => {
        return payment && payment._id && typeof payment._id === 'string';
    };

    const checkEligibility = async (payment) => {
        try {
            if (!payment || !payment.paymentReference) {
                return {
                    eligible: false,
                    message: 'Invalid payment data'
                };
            }

            const response = await fetch(
                `http://localhost:5000/api/ad-categories/check-eligibility/${payment.paymentReference}`,
                {
                    method: 'GET',
                    headers: {
                        ...getAuthHeaders(),
                        'Accept': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    eligible: false,
                    message: errorData.message || 'Error checking eligibility'
                };
            }
            
            const data = await response.json();
            return {
                eligible: data.eligible,
                payment: data.payment,
                message: data.message
            };
        } catch (error) {
            return {
                eligible: false,
                message: `Error: ${error.message}`
            };
        }
    };
  
    useEffect(() => {
            if (detailedBalance?.businessEarnings) {
                Object.values(detailedBalance.businessEarnings).forEach(business => {
                    business.payments.forEach(async payment => {
                        if (!validatePaymentData(payment)) {
                            console.error('Invalid payment data:', payment);
                            return;
                        }
    
                        const eligibility = await checkEligibility(payment);
                        setEligibilityStates(prev => ({
                            ...prev,
                            [payment._id]: eligibility
                        }));
                    });
                });
            }
    }, [detailedBalance]);

    const renderPaymentMethodSelector = (paymentId) => {
        const currentMethod = selectedPaymentMethod[paymentId] || 'mobile_money';
        
        return (
            <Select
                label="Payment Method"
                value={currentMethod}
                onChange={(e) => handlePaymentMethodChange(paymentId, e.target.value)}
                className="border-black focus:ring-black focus:border-black"
            >
                <option value="mobile_money">Mobile Money (Rwanda)</option>
                <option value="bank_card">Bank Card (International)</option>
                <option value="bank_transfer">Bank Transfer</option>
            </Select>
        );
    };

    const renderPaymentFields = (paymentId, withdrawalData) => {
        const method = withdrawalData.paymentMethod;

        switch (method) {
            case 'mobile_money':
                return (
                    <Input
                        label="Phone Number"
                        type="text"
                        placeholder="07XXXXXXXX"
                        value={withdrawalData.phoneNumber || ''}
                        onChange={(e) => handleInputChange(paymentId, 'phoneNumber', e.target.value)}
                        className="border-black focus:ring-black focus:border-black"
                    />
                );

            case 'bank_card':
                return (
                    <div className="space-y-4">
                        <Input
                            label="Card Number"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={withdrawalData.cardNumber || ''}
                            onChange={(e) => {
                                const formatted = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                                handleInputChange(paymentId, 'cardNumber', formatted);
                            }}
                            className="border-black focus:ring-black focus:border-black"
                        />
                        <Input
                            label="Cardholder Name"
                            type="text"
                            placeholder="John Doe"
                            value={withdrawalData.cardHolderName || ''}
                            onChange={(e) => handleInputChange(paymentId, 'cardHolderName', e.target.value)}
                            className="border-black focus:ring-black focus:border-black"
                        />
                        <Grid cols={2} gap={4}>
                            <Select
                                label="Expiry Month"
                                value={withdrawalData.expiryMonth || ''}
                                onChange={(e) => handleInputChange(paymentId, 'expiryMonth', e.target.value)}
                                className="border-black focus:ring-black focus:border-black"
                            >
                                <option value="">Month</option>
                                {Array.from({length: 12}, (_, i) => (
                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {String(i + 1).padStart(2, '0')}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                label="Expiry Year"
                                value={withdrawalData.expiryYear || ''}
                                onChange={(e) => handleInputChange(paymentId, 'expiryYear', e.target.value)}
                                className="border-black focus:ring-black focus:border-black"
                            >
                                <option value="">Year</option>
                                {Array.from({length: 10}, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </Select>
                        </Grid>
                    </div>
                );

            case 'bank_transfer':
                return (
                    <div className="space-y-4">
                        <Input
                            label="Bank Code"
                            type="text"
                            placeholder="e.g., 044 (for Access Bank)"
                            value={withdrawalData.bankCode || ''}
                            onChange={(e) => handleInputChange(paymentId, 'bankCode', e.target.value)}
                            className="border-black focus:ring-black focus:border-black"
                        />
                        <Input
                            label="Account Number"
                            type="text"
                            placeholder="Account Number"
                            value={withdrawalData.accountNumber || ''}
                            onChange={(e) => handleInputChange(paymentId, 'accountNumber', e.target.value)}
                            className="border-black focus:ring-black focus:border-black"
                        />
                        <Input
                            label="Account Name"
                            type="text"
                            placeholder="Account Holder Name"
                            value={withdrawalData.accountName || ''}
                            onChange={(e) => handleInputChange(paymentId, 'accountName', e.target.value)}
                            className="border-black focus:ring-black focus:border-black"
                        />
                    </div>
                );

            default:
                return <div className="text-gray-600">Please select a payment method</div>;
        }
    };

    const renderWithdrawButton = (payment) => {
        const eligibility = eligibilityStates[payment._id];
        const withdrawalData = withdrawals[payment._id];

        if (!eligibility) {
            return (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-300">
                    <span className="text-gray-600 text-sm">Checking eligibility...</span>
                </div>
            );
        }

        if (!eligibility.eligible) {
            return (
                <div className="mt-4 p-3 bg-red-50 border border-red-300">
                    <span className="text-red-600 text-sm">{eligibility.message}</span>
                </div>
            );
        }

        if (!withdrawalData) {
            return (
                <Button
                    onClick={() => handleWithdraw(
                        payment.adId?.businessName || 'Unknown Business',
                        payment._id,
                        payment.amount || 0
                    )}
                    variant="secondary"
                    className="w-full mt-4"
                >
                    Withdraw Earnings
                </Button>
            );
        }

        return (
            <div className="mt-4 p-4 border border-black bg-white">
                <h4 className="text-lg font-semibold mb-4 text-black">
                    Withdraw from {withdrawalData.businessName}
                </h4>
                
                <div className="space-y-4">
                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={withdrawalData.amount}
                        onChange={(e) => handleInputChange(payment._id, 'amount', e.target.value)}
                        className="border-black focus:ring-black focus:border-black"
                    />

                    {renderPaymentMethodSelector(payment._id)}
                    {renderPaymentFields(payment._id, withdrawalData)}

                    {withdrawalData.error && (
                        <div className="p-3 bg-red-50 border border-red-300">
                            <span className="text-red-600 text-sm">{withdrawalData.error}</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleWithdrawSubmit(payment._id)}
                            variant="secondary"
                            className="flex-1"
                        >
                            Submit Withdrawal
                        </Button>
                        <Button
                            onClick={() => setWithdrawals(prev => ({
                                ...prev,
                                [payment._id]: undefined
                            }))}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-300">
                        <div className="text-xs text-gray-600">
                            {withdrawalData.paymentMethod === 'mobile_money' && (
                                <div>
                                    <strong>Mobile Money:</strong> Payments processed to Rwanda mobile money (MTN/Airtel).
                                    <br />
                                    <strong>Currency:</strong> RWF (Rwandan Francs)
                                </div>
                            )}
                            {withdrawalData.paymentMethod === 'bank_card' && (
                                <div>
                                    <strong>Bank Card:</strong> International card withdrawals supported.
                                    <br />
                                    <strong>Currency:</strong> USD - Processing: 3-5 business days.
                                </div>
                            )}
                            {withdrawalData.paymentMethod === 'bank_transfer' && (
                                <div>
                                    <strong>Bank Transfer:</strong> Direct bank account transfer.
                                    <br />
                                    <strong>Currency:</strong> USD - Processing: 1-3 business days.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex items-center">
                    <Loader className="animate-spin mr-2" size={24} />
                    <span className="text-gray-700">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to access your wallet.</p>
                    <Button onClick={() => navigate('/login')} variant="primary">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    const userId = getUserId();
    if (!userId) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
                    <p className="text-gray-600 mb-6">User authentication error. Please log out and log in again.</p>
                    <Button onClick={() => navigate('/login')} variant="primary">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 py-12">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Button 
                        onClick={() => navigate(-1)} 
                        variant="outline"
                        icon={ArrowLeft}
                        iconPosition="left"
                    >
                        Back
                    </Button>
                    <h1 className="text-2xl font-semibold text-black">Wallet</h1>
                </div>

                {/* Balance Summary */}
                {detailedBalance && (
                    <div className="mb-12 p-6 border border-black bg-white">
                        <h3 className="text-lg font-semibold text-black mb-4">Balance Summary</h3>
                        <Grid cols={2} gap={6}>
                            <div className="flex items-center">
                                <DollarSign size={20} className="mr-2 text-black" />
                                <div className='flex justify-center items-center gap-2'>
                                    <span className="text-gray-700 text-sm">Total Earnings</span>
                                    <div className="font-semibold text-black">${detailedBalance.totalEarnings || 0}</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Wallet size={20} className="mr-2 text-black" />
                                <div className='flex justify-center items-center gap-2'>
                                    <span className="text-gray-700 text-sm">Available Balance</span>
                                    <div className="font-semibold text-black">${detailedBalance.availableBalance || 0}</div>
                                </div>
                            </div>
                        </Grid>
                    </div>
                )}

                {/* Business Earnings */}
                {detailedBalance?.businessEarnings && Object.values(detailedBalance.businessEarnings).length > 0 ? (
                    <div className="space-y-6">
                        {Object.values(detailedBalance.businessEarnings).map((business, index) => (
                            <div key={index} className="border border-black p-6 bg-gray-100">
                                <h3 className="text-lg font-semibold text-black mb-6">
                                    {business.businessName || `Business ${index + 1}`}
                                </h3>
                                
                                <div className="space-y-4">
                                    {business.payments && business.payments.map((payment) => (
                                        <div key={payment._id} className="p-4 bg-gray-50 border border-gray-300">
                                            <Grid cols={3} gap={4} className="mb-4 flex justify-center ">
                                                <div className="flex items-center justify-center">
                                                    <DollarSign size={16} className="mr-2 text-gray-600" />
                                                    <div className='flex justify-center items-center gap-1'>
                                                        <span className="text-gray-600 text-sm">Amount</span>
                                                        <div className="font-medium text-black">${payment.amount || 0}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <div className="mr-2">
                                                        {payment.status === 'available' ? (
                                                            <CheckCircle size={16} className="text-green-600" />
                                                        ) : payment.status === 'withdrawn' ? (
                                                            <CheckCircle size={16} className="text-blue-600" />
                                                        ) : (
                                                            <Clock size={16} className="text-yellow-600" />
                                                        )}
                                                    </div>
                                                    <div className='flex justify-center items-center gap-1'>
                                                        <span className="text-gray-600 text-sm">Status</span>
                                                        <div className="font-medium text-black">{payment.status || 'pending'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <Eye size={16} className="mr-2 text-gray-600" />
                                                    <div className='flex justify-center items-center gap-1'>
                                                        <span className="text-gray-600 text-sm">Views</span>
                                                        <div className="font-medium text-black">
                                                            {payment.currentViews || 0}/{payment.viewsRequired || 1000}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            
                                            {renderWithdrawButton(payment)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : detailedBalance ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <Wallet size={64} className="mx-auto mb-6 text-black" />
                            <h2 className="text-2xl font-semibold mb-4 text-black">No Earnings Yet</h2>
                            <p className="text-gray-600 mb-6">Start earning by displaying ads on your websites.</p>
                            <Button onClick={() => navigate('/')} variant="primary">
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Button
                            onClick={fetchDetailedBalance}
                            variant="primary"
                            loading={!detailedBalance}
                        >
                            Load Wallet Data
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletComponent;