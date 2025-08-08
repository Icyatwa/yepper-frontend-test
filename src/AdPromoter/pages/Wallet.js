// Wallet.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  ArrowLeft,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CreditCard,
  Users,
  Globe
} from 'lucide-react';
import axios from 'axios';
import { Button, Text, Heading, Container, Badge } from '../../components/components';
import LoadingSpinner from '../../components/LoadingSpinner';

const Wallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine wallet type from URL or user role
  const [walletType, setWalletType] = useState('webOwner'); // 'webOwner' or 'advertiser'
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [transactionsLoading, setTransactionsLoading] = useState(false);

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
    // Determine wallet type from URL path or query params
    const pathSegments = location.pathname.split('/');
    if (pathSegments.includes('advertiser')) {
      setWalletType('advertiser');
    } else {
      setWalletType('webOwner');
    }
    
    fetchUserInfo();
  }, [location]);

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [walletType, user]);

  useEffect(() => {
    if (wallet) {
      fetchTransactions(currentPage);
    }
  }, [currentPage, wallet]);

  const fetchUserInfo = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: getAuthHeaders()
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchWalletData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/ad-categories/wallet/${walletType}/balance`, {
        headers: getAuthHeaders()
      });

      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      if (error.response?.status === 404) {
        // Wallet doesn't exist yet - show zero balance
        setWallet({
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
          totalRefunded: 0
        });
      } else {
        setError('Failed to load wallet information');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1) => {
    setTransactionsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `http://localhost:5000/api/ad-categories/wallet/${walletType}/transactions?page=${page}&limit=10`, 
        {
          headers: getAuthHeaders()
        }
      );

      setTransactions(response.data.transactions || []);
      setPagination({
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        total: response.data.total || 0
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.response?.status !== 404) {
        setError('Failed to load transaction history');
      }
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getTransactionIcon = (transaction) => {
    switch (transaction.type) {
      case 'refund_credit':
        return <RefreshCw className="w-4 h-4 text-green-500" />;
      case 'refund_debit':
        return <RefreshCw className="w-4 h-4 text-red-500" />;
      case 'credit':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'debit':
        return <DollarSign className="w-4 h-4 text-red-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionBadge = (transaction) => {
    const badgeClasses = {
      'refund_credit': 'bg-green-100 text-green-800',
      'refund_debit': 'bg-red-100 text-red-800',
      'credit': 'bg-blue-100 text-blue-800',
      'debit': 'bg-orange-100 text-orange-800'
    };

    const badgeTexts = {
      'refund_credit': 'Refund Received',
      'refund_debit': 'Refund Processed',
      'credit': 'Payment Received',
      'debit': 'Payment Sent'
    };

    return (
      <Badge className={`${badgeClasses[transaction.type]} text-xs`}>
        {badgeTexts[transaction.type] || transaction.type}
      </Badge>
    );
  };

  const switchWalletType = () => {
    const newType = walletType === 'webOwner' ? 'advertiser' : 'webOwner';
    setWalletType(newType);
    setCurrentPage(1);
    setTransactions([]);
    setWallet(null);
    setLoading(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Wallet Type Switcher */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <Heading level={1} className="flex items-center gap-3">
              <WalletIcon className="w-8 h-8 text-primary" />
              {walletType === 'webOwner' ? 'Publisher' : 'Advertiser'} Wallet
            </Heading>
            
            <Button
              variant="outline"
              onClick={switchWalletType}
              className="flex items-center gap-2"
            >
              {walletType === 'webOwner' ? <CreditCard className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              Switch to {walletType === 'webOwner' ? 'Advertiser' : 'Publisher'} Wallet
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Wallet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {walletType === 'webOwner' ? 'Total Earned' : 'Total Spent'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(walletType === 'webOwner' ? (wallet?.totalEarned || 0) : (wallet?.totalSpent || 0))}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Refunded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(wallet?.totalRefunded || 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {wallet?.lastUpdated ? formatDate(wallet.lastUpdated) : 'Never'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Heading level={2} className="text-lg font-semibold text-gray-900">
                Transaction History
              </Heading>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTransactions(currentPage)}
                disabled={transactionsLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${transactionsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {transactionsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction)}
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-600 max-w-md truncate">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getTransactionBadge(transaction)}
                          <span className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      {transaction.adId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => navigate(`/ads/${transaction.adId._id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Ad
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * 10 + 1, pagination.total)} to{' '}
                  {Math.min(currentPage * 10, pagination.total)} of {pagination.total} transactions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || transactionsLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages || transactionsLoading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Wallet;













// // Wallet.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Wallet, DollarSign, Eye, Loader, CheckCircle, Clock } from 'lucide-react';
// import { Button, Grid, Badge, Input, Select, Container } from '../../components/components';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const WalletComponent = () => {
//     const { user, loading: authLoading } = useAuth();
//     const navigate = useNavigate();
//     const [balance, setBalance] = useState(null);
//     const [detailedBalance, setDetailedBalance] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [withdrawals, setWithdrawals] = useState({});
//     const [eligibilityStates, setEligibilityStates] = useState({});  
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});

//     useEffect(() => {
//       console.log('User object:', user);
//       console.log('Auth loading:', authLoading);
//     }, [user, authLoading]);

//     useEffect(() => {
//       // Wait for auth to finish loading and user to be available
//       if (!authLoading && user) {
//         fetchBalance();
//         fetchDetailedBalance();
//       } else if (!authLoading && !user) {
//         setError('Please log in to view your wallet');
//         setLoading(false);
//       }
//     }, [user, authLoading]);
  
//     useEffect(() => {
//         fetchDetailedBalance();
//     }, [user?.id]);

//     const getAuthHeaders = () => {
//         const token = user?.token || user?.accessToken || localStorage.getItem('token') || localStorage.getItem('authToken');
        
//         if (!token) {
//             console.warn('No authentication token found');
//             return {};
//         }

//         return {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         };
//     };

//     const getUserId = () => {
//       // Try different possible user ID properties
//       return user?.id || user?.userId || user?._id || user?.uid;
//     };

//     const fetchBalance = async () => {
//       const userId = getUserId();
      
//       if (!userId) {
//         setError('User ID not found. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         const headers = getAuthHeaders();
//         console.log('Sending request with headers:', headers); // Debug log
        
//         const response = await fetch(`http://localhost:5000/api/ad-categories/balance/${userId}`, {
//           method: 'GET',
//           headers: headers
//         });
        
//         if (response.status === 401) {
//           setError('Authentication failed. Please log in again.');
//           // Optionally redirect to login or refresh token
//           return;
//         }
        
//         if (response.status === 404) {
//           setBalance({
//             availableBalance: 0,
//             totalEarnings: 0
//           });
//           return;
//         }
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch balance: ${response.statusText}`);
//         }
        
//         const data = await response.json();
//         setBalance(data);
//       } catch (err) {
//         console.error('Error fetching balance:', err);
//         setError('Unable to fetch wallet balance. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchDetailedBalance = async () => {
//       const userId = getUserId();
      
//       if (!userId) {
//         setError('User ID not found. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const headers = getAuthHeaders();
//         console.log('Sending detailed earnings request with headers:', headers); // Debug log
        
//         const response = await fetch(`http://localhost:5000/api/ad-categories/earnings/${userId}`, {
//           method: 'GET',
//           headers: headers
//         });
        
//         if (response.status === 401) {
//           setError('Authentication failed. Please log in again.');
//           return;
//         }
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch earnings: ${response.statusText}`);
//         }
        
//         const data = await response.json();

//         const processedData = {
//           ...data,
//           monthlyEarnings: data.monthlyEarnings.map(month => ({
//             ...month,
//             payments: month.payments.map(payment => ({
//               ...payment,
//               _id: payment._id || payment.paymentReference
//             }))
//           }))
//         };
        
//         // Group payments by business
//         const groupedByBusiness = processedData.monthlyEarnings.reduce((acc, month) => {
//           month.payments.forEach(payment => {
//             if (!acc[payment.businessName]) {
//               acc[payment.businessName] = {
//                 totalAmount: 0,
//                 businessInfo: {
//                   name: payment.businessName,
//                   location: payment.businessLocation,
//                   link: payment.businessLink,
//                   email: payment.advertiserEmail
//                 },
//                 payments: []
//               };
//             }
//             acc[payment.businessName].payments.push(payment);
//             acc[payment.businessName].totalAmount += payment.amount;
//           });
//           return acc;
//         }, {});

//         setDetailedBalance({
//           totalBalance: data.totalBalance,
//           businessEarnings: groupedByBusiness
//         });
//       } catch (err) {
//         console.error('Error fetching detailed balance:', err);
//         setError('Unable to fetch detailed earnings. Please try again later.');
//       }
//     };

//     const validateCardNumber = (cardNumber) => {
//         const cleaned = cardNumber.replace(/\s/g, '');
//         return /^\d{13,19}$/.test(cleaned);
//     };

//     const validateExpiryDate = (month, year) => {
//         const currentDate = new Date();
//         const currentYear = currentDate.getFullYear();
//         const currentMonth = currentDate.getMonth() + 1;
        
//         const expYear = parseInt(year);
//         const expMonth = parseInt(month);
        
//         if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
//             return false;
//         }
//         return true;
//     };

//     const handlePaymentMethodChange = (paymentId, method) => {
//         setSelectedPaymentMethod(prev => ({
//             ...prev,
//             [paymentId]: method
//         }));
        
//         // Reset withdrawal data when payment method changes
//         setWithdrawals(prev => ({
//             ...prev,
//             [paymentId]: {
//                 amount: prev[paymentId]?.amount || '',
//                 paymentMethod: method,
//                 error: null
//             }
//         }));
//     };

//     const handleWithdraw = async (businessName, paymentId, amount) => {
//         const currentMethod = selectedPaymentMethod[paymentId] || 'mobile_money';
        
//         setWithdrawals(prev => ({
//             ...prev,
//             [paymentId]: {
//                 businessName,
//                 amount: amount.toString(),
//                 paymentMethod: currentMethod,
//                 // Initialize fields based on payment method
//                 ...(currentMethod === 'mobile_money' && { phoneNumber: '' }),
//                 ...(currentMethod === 'bank_card' && { 
//                     cardNumber: '',
//                     cardHolderName: '',
//                     expiryMonth: '',
//                     expiryYear: ''
//                 }),
//                 ...(currentMethod === 'bank_transfer' && {
//                     bankCode: '',
//                     accountNumber: '',
//                     accountName: ''
//                 }),
//                 error: null
//             }
//         }));
//     };
  
//     const handleInputChange = (paymentId, field, value) => {
//         setWithdrawals(prev => ({
//             ...prev,
//             [paymentId]: {
//                 ...prev[paymentId],
//                 [field]: value,
//                 error: null
//             }
//         }));
//     };

//     const validateWithdrawalData = (withdrawalData) => {
//         const { amount, paymentMethod } = withdrawalData;
        
//         if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
//             return 'Please enter a valid amount';
//         }

//         switch (paymentMethod) {
//             case 'mobile_money':
//                 if (!withdrawalData.phoneNumber || !/^(07\d{8})$/.test(withdrawalData.phoneNumber)) {
//                     return 'Please enter a valid phone number (07XXXXXXXX)';
//                 }
//                 break;
                
//             case 'bank_card':
//                 if (!withdrawalData.cardNumber || !validateCardNumber(withdrawalData.cardNumber)) {
//                     return 'Please enter a valid card number';
//                 }
//                 if (!withdrawalData.cardHolderName || withdrawalData.cardHolderName.trim().length < 2) {
//                     return 'Please enter a valid cardholder name';
//                 }
//                 if (!withdrawalData.expiryMonth || !withdrawalData.expiryYear) {
//                     return 'Please enter card expiry date';
//                 }
//                 if (!validateExpiryDate(withdrawalData.expiryMonth, withdrawalData.expiryYear)) {
//                     return 'Card has expired or invalid expiry date';
//                 }
//                 break;
                
//             case 'bank_transfer':
//                 if (!withdrawalData.bankCode || !withdrawalData.accountNumber || !withdrawalData.accountName) {
//                     return 'Please fill in all bank details';
//                 }
//                 break;
                
//             default:
//                 return 'Please select a valid payment method';
//         }
        
//         return null;
//     };

//     const handleWithdrawSubmit = async (paymentId) => {
//         const withdrawalData = withdrawals[paymentId];
//         const userId = getUserId();

//         // Validate withdrawal data
//         const validationError = validateWithdrawalData(withdrawalData);
//         if (validationError) {
//             setWithdrawals(prev => ({
//                 ...prev,
//                 [paymentId]: {
//                     ...prev[paymentId],
//                     error: validationError
//                 }
//             }));
//             return;
//         }

//         try {
//             const requestData = {
//                 amount: parseFloat(withdrawalData.amount),
//                 userId: userId,
//                 paymentId: paymentId,
//                 paymentMethod: withdrawalData.paymentMethod,
//                 currency: withdrawalData.paymentMethod === 'mobile_money' ? 'RWF' : 'USD'
//             };

//             // Add payment method specific data
//             switch (withdrawalData.paymentMethod) {
//                 case 'mobile_money':
//                     requestData.phoneNumber = withdrawalData.phoneNumber;
//                     break;
//                 case 'bank_card':
//                     requestData.cardNumber = withdrawalData.cardNumber;
//                     requestData.cardHolderName = withdrawalData.cardHolderName;
//                     requestData.expiryMonth = withdrawalData.expiryMonth;
//                     requestData.expiryYear = withdrawalData.expiryYear;
//                     break;
//                 case 'bank_transfer':
//                     requestData.bankCode = withdrawalData.bankCode;
//                     requestData.accountNumber = withdrawalData.accountNumber;
//                     requestData.accountName = withdrawalData.accountName;
//                     break;
//             }

//             console.log('Sending withdrawal request:', requestData);

//             // TRY AUTOMATIC FIRST, FALL BACK TO MANUAL
//             let response;
//             let isManual = false;
            
//             try {
//                 // Try automatic withdrawal first
//                 response = await fetch("http://localhost:5000/api/ad-categories/withdraw", {
//                     method: 'POST',
//                     headers: getAuthHeaders(),
//                     body: JSON.stringify(requestData),
//                 });
                
//                 const data = await response.json();
                
//                 // If it's an IP whitelist error, automatically try manual
//                 if (!response.ok && data.error && data.error.includes('IP Whitelisting')) {
//                     console.log('🔄 IP issue detected, switching to manual withdrawal...');
//                     throw new Error('IP_WHITELIST_ERROR');
//                 }
                
//             } catch (err) {
//                 if (err.message === 'IP_WHITELIST_ERROR' || err.message.includes('IP Whitelisting')) {
//                     console.log('🔄 Switching to manual withdrawal due to IP issues...');
                    
//                     // Try manual withdrawal
//                     response = await fetch("http://localhost:5000/api/ad-categories/withdraw-manual", {
//                         method: 'POST',
//                         headers: getAuthHeaders(),
//                         body: JSON.stringify(requestData),
//                     });
//                     isManual = true;
//                 } else {
//                     throw err;
//                 }
//             }

//             const data = await response.json();
//             console.log('Withdrawal response:', data);

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to process withdrawal');
//             }

//             // Success - clear the withdrawal form
//             setWithdrawals(prev => ({
//                 ...prev,
//                 [paymentId]: undefined
//             }));
            
//             // Refresh balance
//             fetchDetailedBalance();
            
//             if (isManual) {
//                 alert(`Manual withdrawal request submitted successfully! 
//         Reference: ${data.reference}
//         Processing time: ${data.estimated_processing_time}
//         Status: ${data.status}`);
//             } else {
//                 alert(`Withdrawal initiated successfully! Reference: ${data.reference}`);
//             }
            
//         } catch (err) {
//             console.error('Withdrawal error:', err);
//             setWithdrawals(prev => ({
//                 ...prev,
//                 [paymentId]: {
//                     ...prev[paymentId],
//                     error: err.message
//                 }
//             }));
//         }
//     };

//     const validatePaymentData = (payment) => {
//         return payment && payment._id && typeof payment._id === 'string';
//     };

//     const checkEligibility = async (payment) => {
//         try {
//             if (!payment || !payment.paymentReference) {
//                 return {
//                     eligible: false,
//                     message: 'Invalid payment data'
//                 };
//             }

//             const response = await fetch(
//                 `http://localhost:5000/api/ad-categories/check-eligibility/${payment.paymentReference}`,
//                 {
//                     method: 'GET',
//                     headers: {
//                         ...getAuthHeaders(),
//                         'Accept': 'application/json'
//                     }
//                 }
//             );
            
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 return {
//                     eligible: false,
//                     message: errorData.message || 'Error checking eligibility'
//                 };
//             }
            
//             const data = await response.json();
//             return {
//                 eligible: data.eligible,
//                 payment: data.payment,
//                 message: data.message
//             };
//         } catch (error) {
//             return {
//                 eligible: false,
//                 message: `Error: ${error.message}`
//             };
//         }
//     };
  
//     useEffect(() => {
//             if (detailedBalance?.businessEarnings) {
//                 Object.values(detailedBalance.businessEarnings).forEach(business => {
//                     business.payments.forEach(async payment => {
//                         if (!validatePaymentData(payment)) {
//                             console.error('Invalid payment data:', payment);
//                             return;
//                         }
    
//                         const eligibility = await checkEligibility(payment);
//                         setEligibilityStates(prev => ({
//                             ...prev,
//                             [payment._id]: eligibility
//                         }));
//                     });
//                 });
//             }
//     }, [detailedBalance]);

//     const renderPaymentMethodSelector = (paymentId) => {
//         const currentMethod = selectedPaymentMethod[paymentId] || 'mobile_money';
        
//         return (
//             <Select
//                 label="Payment Method"
//                 value={currentMethod}
//                 onChange={(e) => handlePaymentMethodChange(paymentId, e.target.value)}
//                 className="border-black focus:ring-black focus:border-black"
//             >
//                 <option value="mobile_money">Mobile Money (Rwanda)</option>
//                 <option value="bank_card">Bank Card (International)</option>
//                 <option value="bank_transfer">Bank Transfer</option>
//             </Select>
//         );
//     };

//     const renderPaymentFields = (paymentId, withdrawalData) => {
//         const method = withdrawalData.paymentMethod;

//         switch (method) {
//             case 'mobile_money':
//                 return (
//                     <Input
//                         label="Phone Number"
//                         type="text"
//                         placeholder="07XXXXXXXX"
//                         value={withdrawalData.phoneNumber || ''}
//                         onChange={(e) => handleInputChange(paymentId, 'phoneNumber', e.target.value)}
//                         className="border-black focus:ring-black focus:border-black"
//                     />
//                 );

//             case 'bank_card':
//                 return (
//                     <div className="space-y-4">
//                         <Input
//                             label="Card Number"
//                             type="text"
//                             placeholder="1234 5678 9012 3456"
//                             value={withdrawalData.cardNumber || ''}
//                             onChange={(e) => {
//                                 const formatted = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
//                                 handleInputChange(paymentId, 'cardNumber', formatted);
//                             }}
//                             className="border-black focus:ring-black focus:border-black"
//                         />
//                         <Input
//                             label="Cardholder Name"
//                             type="text"
//                             placeholder="John Doe"
//                             value={withdrawalData.cardHolderName || ''}
//                             onChange={(e) => handleInputChange(paymentId, 'cardHolderName', e.target.value)}
//                             className="border-black focus:ring-black focus:border-black"
//                         />
//                         <Grid cols={2} gap={4}>
//                             <Select
//                                 label="Expiry Month"
//                                 value={withdrawalData.expiryMonth || ''}
//                                 onChange={(e) => handleInputChange(paymentId, 'expiryMonth', e.target.value)}
//                                 className="border-black focus:ring-black focus:border-black"
//                             >
//                                 <option value="">Month</option>
//                                 {Array.from({length: 12}, (_, i) => (
//                                     <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
//                                         {String(i + 1).padStart(2, '0')}
//                                     </option>
//                                 ))}
//                             </Select>
//                             <Select
//                                 label="Expiry Year"
//                                 value={withdrawalData.expiryYear || ''}
//                                 onChange={(e) => handleInputChange(paymentId, 'expiryYear', e.target.value)}
//                                 className="border-black focus:ring-black focus:border-black"
//                             >
//                                 <option value="">Year</option>
//                                 {Array.from({length: 10}, (_, i) => {
//                                     const year = new Date().getFullYear() + i;
//                                     return (
//                                         <option key={year} value={year}>
//                                             {year}
//                                         </option>
//                                     );
//                                 })}
//                             </Select>
//                         </Grid>
//                     </div>
//                 );

//             case 'bank_transfer':
//                 return (
//                     <div className="space-y-4">
//                         <Input
//                             label="Bank Code"
//                             type="text"
//                             placeholder="e.g., 044 (for Access Bank)"
//                             value={withdrawalData.bankCode || ''}
//                             onChange={(e) => handleInputChange(paymentId, 'bankCode', e.target.value)}
//                             className="border-black focus:ring-black focus:border-black"
//                         />
//                         <Input
//                             label="Account Number"
//                             type="text"
//                             placeholder="Account Number"
//                             value={withdrawalData.accountNumber || ''}
//                             onChange={(e) => handleInputChange(paymentId, 'accountNumber', e.target.value)}
//                             className="border-black focus:ring-black focus:border-black"
//                         />
//                         <Input
//                             label="Account Name"
//                             type="text"
//                             placeholder="Account Holder Name"
//                             value={withdrawalData.accountName || ''}
//                             onChange={(e) => handleInputChange(paymentId, 'accountName', e.target.value)}
//                             className="border-black focus:ring-black focus:border-black"
//                         />
//                     </div>
//                 );

//             default:
//                 return <div className="text-gray-600">Please select a payment method</div>;
//         }
//     };

//     const renderWithdrawButton = (payment) => {
//         const eligibility = eligibilityStates[payment._id];
//         const withdrawalData = withdrawals[payment._id];

//         if (!eligibility) {
//             return (
//                 <div className="mt-4 p-3 bg-gray-50 border border-gray-300">
//                     <span className="text-gray-600 text-sm">Checking eligibility...</span>
//                 </div>
//             );
//         }

//         if (!eligibility.eligible) {
//             return (
//                 <div className="mt-4 p-3 bg-red-50 border border-red-300">
//                     <span className="text-red-600 text-sm">{eligibility.message}</span>
//                 </div>
//             );
//         }

//         if (!withdrawalData) {
//             return (
//                 <Button
//                     onClick={() => handleWithdraw(
//                         payment.adId?.businessName || 'Unknown Business',
//                         payment._id,
//                         payment.amount || 0
//                     )}
//                     variant="secondary"
//                     className="w-full mt-4"
//                 >
//                     Withdraw Earnings
//                 </Button>
//             );
//         }

//         return (
//             <div className="mt-4 p-4 border border-black bg-white">
//                 <h4 className="text-lg font-semibold mb-4 text-black">
//                     Withdraw from {withdrawalData.businessName}
//                 </h4>
                
//                 <div className="space-y-4">
//                     <Input
//                         label="Amount"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={withdrawalData.amount}
//                         onChange={(e) => handleInputChange(payment._id, 'amount', e.target.value)}
//                         className="border-black focus:ring-black focus:border-black"
//                     />

//                     {renderPaymentMethodSelector(payment._id)}
//                     {renderPaymentFields(payment._id, withdrawalData)}

//                     {withdrawalData.error && (
//                         <div className="p-3 bg-red-50 border border-red-300">
//                             <span className="text-red-600 text-sm">{withdrawalData.error}</span>
//                         </div>
//                     )}

//                     <div className="flex gap-3">
//                         <Button
//                             onClick={() => handleWithdrawSubmit(payment._id)}
//                             variant="secondary"
//                             className="flex-1"
//                         >
//                             Submit Withdrawal
//                         </Button>
//                         <Button
//                             onClick={() => setWithdrawals(prev => ({
//                                 ...prev,
//                                 [payment._id]: undefined
//                             }))}
//                             variant="outline"
//                         >
//                             Cancel
//                         </Button>
//                     </div>

//                     <div className="p-3 bg-gray-50 border border-gray-300">
//                         <div className="text-xs text-gray-600">
//                             {withdrawalData.paymentMethod === 'mobile_money' && (
//                                 <div>
//                                     <strong>Mobile Money:</strong> Payments processed to Rwanda mobile money (MTN/Airtel).
//                                     <br />
//                                     <strong>Currency:</strong> RWF (Rwandan Francs)
//                                 </div>
//                             )}
//                             {withdrawalData.paymentMethod === 'bank_card' && (
//                                 <div>
//                                     <strong>Bank Card:</strong> International card withdrawals supported.
//                                     <br />
//                                     <strong>Currency:</strong> USD - Processing: 3-5 business days.
//                                 </div>
//                             )}
//                             {withdrawalData.paymentMethod === 'bank_transfer' && (
//                                 <div>
//                                     <strong>Bank Transfer:</strong> Direct bank account transfer.
//                                     <br />
//                                     <strong>Currency:</strong> USD - Processing: 1-3 business days.
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Required</h2>
//                     <p className="text-gray-600 mb-6">Please log in to access your wallet.</p>
//                     <Button onClick={() => navigate('/login')} variant="primary">
//                         Go to Login
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     const userId = getUserId();
//     if (!userId) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
//                     <p className="text-gray-600 mb-6">User authentication error. Please log out and log in again.</p>
//                     <Button onClick={() => navigate('/login')} variant="primary">
//                         Go to Login
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white">
//             {/* Header */}
//             <header className="border-b border-gray-200 bg-white">
//                 <Container>
//                     <div className="h-16 flex items-center justify-between">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="flex items-center text-gray-600 hover:text-black transition-colors"
//                         >
//                             <ArrowLeft size={18} className="mr-2" />
//                             <span className="font-medium">Back</span>
//                         </button>
//                         <Badge variant="default">Wallet</Badge>
//                     </div>
//                 </Container>
//             </header>
//             <div className="max-w-6xl mx-auto px-4 py-12">
//                 {/* Balance Summary */}
//                 {detailedBalance && (
//                     <div className="mb-12 p-6 border border-black bg-white">
//                         <h3 className="text-lg font-semibold text-black mb-4">Balance Summary</h3>
//                         <Grid cols={2} gap={6}>
//                             <div className="flex items-center">
//                                 <DollarSign size={20} className="mr-2 text-black" />
//                                 <div className='flex justify-center items-center gap-2'>
//                                     <span className="text-gray-700 text-sm">Total Earnings</span>
//                                     <div className="font-semibold text-black">${detailedBalance.totalEarnings || 0}</div>
//                                 </div>
//                             </div>
//                             <div className="flex items-center">
//                                 <Wallet size={20} className="mr-2 text-black" />
//                                 <div className='flex justify-center items-center gap-2'>
//                                     <span className="text-gray-700 text-sm">Available Balance</span>
//                                     <div className="font-semibold text-black">${detailedBalance.availableBalance || 0}</div>
//                                 </div>
//                             </div>
//                         </Grid>
//                     </div>
//                 )}

//                 {/* Business Earnings */}
//                 {detailedBalance?.businessEarnings && Object.values(detailedBalance.businessEarnings).length > 0 ? (
//                     <div className="space-y-6">
//                         {Object.values(detailedBalance.businessEarnings).map((business, index) => (
//                             <div key={index} className="border border-black p-6 bg-gray-100">
//                                 <h3 className="text-lg font-semibold text-black mb-6">
//                                     {business.businessName || `Business ${index + 1}`}
//                                 </h3>
                                
//                                 <div className="space-y-4">
//                                     {business.payments && business.payments.map((payment) => (
//                                         <div key={payment._id} className="p-4 bg-gray-50 border border-gray-300">
//                                             <Grid cols={3} gap={4} className="mb-4 flex justify-center ">
//                                                 <div className="flex items-center justify-center">
//                                                     <DollarSign size={16} className="mr-2 text-gray-600" />
//                                                     <div className='flex justify-center items-center gap-1'>
//                                                         <span className="text-gray-600 text-sm">Amount</span>
//                                                         <div className="font-medium text-black">${payment.amount || 0}</div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center justify-center">
//                                                     <div className="mr-2">
//                                                         {payment.status === 'available' ? (
//                                                             <CheckCircle size={16} className="text-green-600" />
//                                                         ) : payment.status === 'withdrawn' ? (
//                                                             <CheckCircle size={16} className="text-blue-600" />
//                                                         ) : (
//                                                             <Clock size={16} className="text-yellow-600" />
//                                                         )}
//                                                     </div>
//                                                     <div className='flex justify-center items-center gap-1'>
//                                                         <span className="text-gray-600 text-sm">Status</span>
//                                                         <div className="font-medium text-black">{payment.status || 'pending'}</div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center justify-center">
//                                                     <Eye size={16} className="mr-2 text-gray-600" />
//                                                     <div className='flex justify-center items-center gap-1'>
//                                                         <span className="text-gray-600 text-sm">Views</span>
//                                                         <div className="font-medium text-black">
//                                                             {payment.currentViews || 0}/{payment.viewsRequired || 1000}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
                                            
//                                             {renderWithdrawButton(payment)}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : detailedBalance ? (
//                     <div className="flex items-center justify-center min-h-96">
//                         <div className="text-center">
//                             <Wallet size={64} className="mx-auto mb-6 text-black" />
//                             <h2 className="text-2xl font-semibold mb-4 text-black">No Earnings Yet</h2>
//                             <p className="text-gray-600 mb-6">Start earning by displaying ads on your websites.</p>
//                             <Button onClick={() => navigate('/')} variant="primary">
//                                 Go to Dashboard
//                             </Button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div>
//                         <div
//                             loading={!detailedBalance}
//                         >
//                             <LoadingSpinner/>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default WalletComponent;