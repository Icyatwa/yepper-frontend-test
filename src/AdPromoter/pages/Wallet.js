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
  Globe,
  Search
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Button, Grid } from '../../components/components';
import LoadingSpinner from '../../components/LoadingSpinner';

const Wallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [walletType, setWalletType] = useState('webOwner'); // 'webOwner' or 'advertiser'
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

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

  useEffect(() => {
    const performSearch = () => {
      const query = searchQuery.toLowerCase().trim();
      
      if (!query) {
        setFilteredTransactions(transactions);
        return;
      }

      const searched = transactions.filter(transaction => {
        const searchFields = [
          transaction.description?.toLowerCase(),
          transaction.type?.toLowerCase(),
          formatCurrency(transaction.amount).toLowerCase(),
        ];
        return searchFields.some(field => field?.includes(query));
      });
        
      setFilteredTransactions(searched);
    };

    performSearch();
  }, [searchQuery, transactions]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
      setFilteredTransactions(response.data.transactions || []);
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

  const getTransactionTypeDisplay = (transaction) => {
    const typeMap = {
      'refund_credit': 'Refund Received',
      'refund_debit': 'Refund Processed',
      'credit': 'Payment Received',
      'debit': 'Payment Sent'
    };
    return typeMap[transaction.type] || transaction.type;
  };

  const switchWalletType = () => {
    const newType = walletType === 'webOwner' ? 'advertiser' : 'webOwner';
    setWalletType(newType);
    setCurrentPage(1);
    setTransactions([]);
    setFilteredTransactions([]);
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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error loading wallet</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => fetchWalletData()} variant="primary">
              Retry
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">

          <div className='flex justify-between items-center gap-4 mb-12'>
            {/* Search Section */}
            <div className="flex justify-start flex-1">
              <div className="relative w-full max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200"
                />
              </div>
            </div>

            {/* Wallet Type Display */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 bg-white px-4 py-3 border border-black">
                <WalletIcon size={20} className="text-black" />
                <span className="text-sm font-medium text-black">
                  {walletType === 'webOwner' ? 'Publisher' : 'Advertiser'} Wallet
                </span>
              </div>
            </div>

            {/* Switch Wallet Button */}
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                size="lg"
                onClick={switchWalletType}
                icon={walletType === 'webOwner' ? CreditCard : Globe}
                iconPosition="left"
              >
                Switch to {walletType === 'webOwner' ? 'Advertiser' : 'Publisher'}
              </Button>
            </div>

            {/* Back Button */}
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
                icon={ArrowLeft}
                iconPosition="left"
              >
                Back
              </Button>
            </div>
          </div>

          {/* Wallet Overview Cards */}
          <Grid cols={4} gap={6} className="mb-12">
            <div className="border border-black bg-white p-6 transition-all duration-200 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <WalletIcon size={40} className="mr-3 text-black" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">Status</div>
                  <div className="text-sm font-semibold text-black">Active</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">Available Balance</h3>
              </div>

              <div className="mb-6">
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
            </div>

            <div className="border border-black bg-white p-6 transition-all duration-200 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <TrendingUp size={40} className="mr-3 text-black" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">
                  {walletType === 'webOwner' ? 'Total Earned' : 'Total Spent'}
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(walletType === 'webOwner' ? (wallet?.totalEarned || 0) : (wallet?.totalSpent || 0))}
                </p>
              </div>
            </div>

            <div className="border border-black bg-white p-6 transition-all duration-200 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <RefreshCw size={40} className="mr-3 text-black" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">Total Refunded</h3>
              </div>

              <div className="mb-6">
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(wallet?.totalRefunded || 0)}
                </p>
              </div>
            </div>

            <div className="border border-black bg-white p-6 transition-all duration-200 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <Calendar size={40} className="mr-3 text-black" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">Last Updated</h3>
              </div>

              <div className="mb-6">
                <p className="text-sm text-black">
                  {wallet?.lastUpdated ? formatDate(wallet.lastUpdated) : 'Never'}
                </p>
              </div>
            </div>
          </Grid>

          {/* Transaction History */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                <DollarSign size={24} className="text-black" />
                Transaction History ({filteredTransactions.length})
              </h2>
              <Button
                variant="outline"
                onClick={() => fetchTransactions(currentPage)}
                disabled={transactionsLoading}
                icon={RefreshCw}
                iconPosition="left"
                className={transactionsLoading ? 'animate-spin' : ''}
              >
                Refresh
              </Button>
            </div>

            {transactionsLoading ? (
              <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                  <DollarSign size={64} className="mx-auto mb-6 text-black" />
                  <h3 className="text-xl font-semibold mb-4 text-black">
                    {searchQuery ? 'No Transactions Found' : 'No Transactions Yet'}
                  </h3>
                </div>
              </div>
            ) : (
              <Grid cols={2} gap={6}>
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="border border-black bg-white p-6 transition-all duration-200 hover:bg-gray-50"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                        <DollarSign size={40} className="mr-3 text-black" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600 mb-1">Amount</div>
                        <div className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Type */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-black">
                        {getTransactionTypeDisplay(transaction)}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm">{transaction.description}</p>
                    </div>

                    {/* Date */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-600 mb-1">Date:</p>
                      <p className="text-sm text-gray-700">{formatDate(transaction.createdAt)}</p>
                    </div>

                    {/* View Ad Button */}
                    {transaction.adId && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => navigate(`/ads/${transaction.adId._id}`)}
                        icon={Eye}
                        iconPosition="left"
                      >
                        View Related Ad
                      </Button>
                    )}
                  </div>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * 10 + 1, pagination.total)} to{' '}
                  {Math.min(currentPage * 10, pagination.total)} of {pagination.total} transactions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || transactionsLoading}
                    icon={ChevronLeft}
                    iconPosition="left"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages || transactionsLoading}
                    icon={ChevronRight}
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;


























// // Wallet.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Wallet as WalletIcon,
//   DollarSign,
//   TrendingUp,
//   Calendar,
//   Download,
//   ArrowLeft,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   CreditCard,
//   Users,
//   Globe
// } from 'lucide-react';
// import axios from 'axios';
// import { Button, Text, Heading, Container, Badge } from '../../components/components';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const Wallet = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Determine wallet type from URL or user role
//   const [walletType, setWalletType] = useState('webOwner'); // 'webOwner' or 'advertiser'
//   const [user, setUser] = useState(null);
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination] = useState({});
//   const [transactionsLoading, setTransactionsLoading] = useState(false);

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token');
//   };

//   const getAuthHeaders = () => {
//     const token = getAuthToken();
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   useEffect(() => {
//     // Determine wallet type from URL path or query params
//     const pathSegments = location.pathname.split('/');
//     if (pathSegments.includes('advertiser')) {
//       setWalletType('advertiser');
//     } else {
//       setWalletType('webOwner');
//     }
    
//     fetchUserInfo();
//   }, [location]);

//   useEffect(() => {
//     if (user) {
//       fetchWalletData();
//     }
//   }, [walletType, user]);

//   useEffect(() => {
//     if (wallet) {
//       fetchTransactions(currentPage);
//     }
//   }, [currentPage, wallet]);

//   const fetchUserInfo = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get('http://localhost:5000/api/auth/me', {
//         headers: getAuthHeaders()
//       });
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Error fetching user info:', error);
//       if (error.response?.status === 401) {
//         navigate('/login');
//       }
//     }
//   };

//   const fetchWalletData = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(`http://localhost:5000/api/ad-categories/wallet/${walletType}/balance`, {
//         headers: getAuthHeaders()
//       });

//       setWallet(response.data.wallet);
//     } catch (error) {
//       console.error('Error fetching wallet:', error);
//       if (error.response?.status === 401) {
//         navigate('/login');
//         return;
//       }
//       if (error.response?.status === 404) {
//         // Wallet doesn't exist yet - show zero balance
//         setWallet({
//           balance: 0,
//           totalEarned: 0,
//           totalSpent: 0,
//           totalRefunded: 0
//         });
//       } else {
//         setError('Failed to load wallet information');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTransactions = async (page = 1) => {
//     setTransactionsLoading(true);
//     try {
//       const token = getAuthToken();
//       const response = await axios.get(
//         `http://localhost:5000/api/ad-categories/wallet/${walletType}/transactions?page=${page}&limit=10`, 
//         {
//           headers: getAuthHeaders()
//         }
//       );

//       setTransactions(response.data.transactions || []);
//       setPagination({
//         totalPages: response.data.totalPages || 1,
//         currentPage: response.data.currentPage || 1,
//         total: response.data.total || 0
//       });
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       if (error.response?.status !== 404) {
//         setError('Failed to load transaction history');
//       }
//     } finally {
//       setTransactionsLoading(false);
//     }
//   };

//   const getTransactionIcon = (transaction) => {
//     switch (transaction.type) {
//       case 'refund_credit':
//         return <RefreshCw className="w-4 h-4 text-green-500" />;
//       case 'refund_debit':
//         return <RefreshCw className="w-4 h-4 text-red-500" />;
//       case 'credit':
//         return <DollarSign className="w-4 h-4 text-green-500" />;
//       case 'debit':
//         return <DollarSign className="w-4 h-4 text-red-500" />;
//       default:
//         return <DollarSign className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getTransactionBadge = (transaction) => {
//     const badgeClasses = {
//       'refund_credit': 'bg-green-100 text-green-800',
//       'refund_debit': 'bg-red-100 text-red-800',
//       'credit': 'bg-blue-100 text-blue-800',
//       'debit': 'bg-orange-100 text-orange-800'
//     };

//     const badgeTexts = {
//       'refund_credit': 'Refund Received',
//       'refund_debit': 'Refund Processed',
//       'credit': 'Payment Received',
//       'debit': 'Payment Sent'
//     };

//     return (
//       <Badge className={`${badgeClasses[transaction.type]} text-xs`}>
//         {badgeTexts[transaction.type] || transaction.type}
//       </Badge>
//     );
//   };

//   const switchWalletType = () => {
//     const newType = walletType === 'webOwner' ? 'advertiser' : 'webOwner';
//     setWalletType(newType);
//     setCurrentPage(1);
//     setTransactions([]);
//     setWallet(null);
//     setLoading(true);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(Math.abs(amount));
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <Container className="py-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header with Wallet Type Switcher */}
//         <div className="flex items-center justify-between mb-8">
//           <Button
//             variant="outline"
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>
          
//           <div className="flex items-center gap-4">
//             <Heading level={1} className="flex items-center gap-3">
//               <WalletIcon className="w-8 h-8 text-primary" />
//               {walletType === 'webOwner' ? 'Publisher' : 'Advertiser'} Wallet
//             </Heading>
            
//             <Button
//               variant="outline"
//               onClick={switchWalletType}
//               className="flex items-center gap-2"
//             >
//               {walletType === 'webOwner' ? <CreditCard className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
//               Switch to {walletType === 'webOwner' ? 'Advertiser' : 'Publisher'} Wallet
//             </Button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
//             {error}
//           </div>
//         )}

//         {/* Wallet Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Available Balance</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatCurrency(wallet?.balance || 0)}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <WalletIcon className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   {walletType === 'webOwner' ? 'Total Earned' : 'Total Spent'}
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatCurrency(walletType === 'webOwner' ? (wallet?.totalEarned || 0) : (wallet?.totalSpent || 0))}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Refunded</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatCurrency(wallet?.totalRefunded || 0)}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                 <RefreshCw className="h-6 w-6 text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Last Updated</p>
//                 <p className="text-sm text-gray-900">
//                   {wallet?.lastUpdated ? formatDate(wallet.lastUpdated) : 'Never'}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Calendar className="h-6 w-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transaction History */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <Heading level={2} className="text-lg font-semibold text-gray-900">
//                 Transaction History
//               </Heading>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => fetchTransactions(currentPage)}
//                 disabled={transactionsLoading}
//                 className="flex items-center gap-2"
//               >
//                 <RefreshCw className={`w-4 h-4 ${transactionsLoading ? 'animate-spin' : ''}`} />
//                 Refresh
//               </Button>
//             </div>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {transactionsLoading ? (
//               <div className="flex justify-center py-8">
//                 <LoadingSpinner />
//               </div>
//             ) : transactions.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No transactions yet</p>
//               </div>
//             ) : (
//               transactions.map((transaction) => (
//                 <div key={transaction._id} className="p-6 hover:bg-gray-50">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       {getTransactionIcon(transaction)}
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {formatCurrency(transaction.amount)}
//                         </p>
//                         <p className="text-sm text-gray-600 max-w-md truncate">
//                           {transaction.description}
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           {getTransactionBadge(transaction)}
//                           <span className="text-xs text-gray-500">
//                             {formatDate(transaction.createdAt)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className={`font-semibold ${
//                         transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
//                       </p>
//                       {transaction.adId && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="mt-2"
//                           onClick={() => navigate(`/ads/${transaction.adId._id}`)}
//                         >
//                           <Eye className="w-4 h-4 mr-1" />
//                           View Ad
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="px-6 py-4 border-t border-gray-200">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm text-gray-700">
//                   Showing {Math.min((currentPage - 1) * 10 + 1, pagination.total)} to{' '}
//                   {Math.min(currentPage * 10, pagination.total)} of {pagination.total} transactions
//                 </p>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || transactionsLoading}
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     Previous
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                     disabled={currentPage === pagination.totalPages || transactionsLoading}
//                   >
//                     Next
//                     <ChevronRight className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Wallet;