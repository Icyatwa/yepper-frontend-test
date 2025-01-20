import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '../contents/components/card';
import { Button } from '../contents/components/button';
import { Alert, AlertDescription } from '../contents/components/alert';
import {
    BadgeDollarSign,
    Wallet2,
    ChevronRight,
    Clock,
    Building2,
    Link as LinkIcon,
    Mail,
    DollarSign,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    InfoIcon,
    Loader2
} from 'lucide-react';
import Header from '../../components/header';

const WalletComponent = () => {
    const { user } = useClerk();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(null);
    const [detailedBalance, setDetailedBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [withdrawals, setWithdrawals] = useState({});
    const [expandedBusiness, setExpandedBusiness] = useState(null);
    const [eligibilityStates, setEligibilityStates] = useState({});
  
    useEffect(() => {
        fetchBalance();
    }, [user?.id]);
  
    useEffect(() => {
        fetchDetailedBalance();
    }, [user?.id]);
  
    const fetchBalance = async () => {
        if (!user?.id) {
            setError('User ID not found');
            setLoading(false);
            return;
        }
  
        try {
            const response = await fetch(`http://localhost:5000/api/accept/balance/${user.id}`);
            
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
        if (!user?.id) {
            setError('User ID not found');
            setLoading(false);
            return;
        }
  
        try {
            const response = await fetch(`http://localhost:5000/api/accept/earnings/${user.id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch balance: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Group payments by business
            const groupedByBusiness = data.monthlyEarnings.reduce((acc, month) => {
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
            console.error('Error fetching balance:', err);
            setError('Unable to fetch wallet balance. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
  
    const handleWithdraw = async (businessName, paymentId, amount) => {
        setWithdrawals(prev => ({
            ...prev,
            [paymentId]: {
                isWithdrawing: true,
                amount: '',
                phoneNumber: '',
                error: ''
            }
        }));
    };
  
    const handleWithdrawSubmit = async (paymentId) => {
        const withdrawalData = withdrawals[paymentId];
        if (!withdrawalData.amount || !withdrawalData.phoneNumber) {
            setWithdrawals(prev => ({
                ...prev,
                [paymentId]: {
                    ...prev[paymentId],
                    error: 'Please fill in all fields'
                }
            }));
            return;
        }
  
        try {
            const response = await fetch("http://localhost:5000/api/accept/withdraw", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(withdrawalData.amount),
                    phoneNumber: withdrawalData.phoneNumber,
                    userId: user.id,
                    paymentId: paymentId
                }),
            });
  
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to process withdrawal');
            }
  
            setWithdrawals(prev => ({
                ...prev,
                [paymentId]: undefined
            }));
            fetchDetailedBalance();
            
        } catch (err) {
            setWithdrawals(prev => ({
                ...prev,
                [paymentId]: {
                    ...prev[paymentId],
                    error: err.message
                }
            }));
        }
    };
  
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
  
    const validatePaymentData = (payment) => {
        // Update validation to check for MongoDB _id instead of paymentTrackerId
        return payment && payment._id && typeof payment._id === 'string';
    };

    const checkEligibility = async (payment) => {
        try {
          // Use payment._id instead of paymentTrackerId
          if (!payment._id) {
            console.error('No payment ID found:', payment);
            return {
              eligible: false,
              message: 'Invalid payment reference'
            };
          }
      
          const response = await fetch(`http://localhost:5000/api/accept/check-eligibility/${payment._id}`);
          const data = await response.json();
          
          if (!response.ok) {
            return {
              eligible: false,
              message: data.message || 'Error checking eligibility'
            };
          }
          
          return {
            eligible: data.eligible,
            payment: data.payment,
            message: data.message
          };
        } catch (error) {
          console.error('Eligibility check error:', error);
          return {
            eligible: false,
            message: 'Error checking eligibility'
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

    const renderWithdrawButton = (payment) => {
        if (!payment._id) {
          return (
            <Button disabled className="w-full bg-gray-400">
              <InfoIcon className="h-4 w-4 mr-2" />
              Invalid Payment Data
            </Button>
          );
        }
      
        const eligibility = eligibilityStates[payment._id];
      
        if (!eligibility) {
          return (
            <Button disabled className="w-full bg-gray-400">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking Eligibility...
            </Button>
          );
        }
      
        return (
          <Button
            onClick={() => handleWithdraw(payment.businessName, payment._id, payment.amount)}
            disabled={!eligibility.eligible}
            className={`w-full ${
              eligibility.eligible 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-gray-400'
            }`}
          >
            {eligibility.eligible ? (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Withdraw Funds
              </>
            ) : (
              <div className="flex items-center" title={eligibility.message}>
                <InfoIcon className="h-4 w-4 mr-2" />
                {eligibility.message}
              </div>
            )}
          </Button>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-8">
                        <div className="h-40 bg-gray-200 rounded-lg" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className='ad-waitlist min-h-screen'>
            <Header />

            <div className="w-full bg-white rounded-lg shadow-md container mx-auto px-4 py-8 md:py-16">
                {/* Header Section */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {/* Title Section */}
                        <div className="flex items-center gap-3">
                            <Wallet2 className="h-6 w-6 sm:h-8 sm:w-8 text-[#FF4500]" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wallet</h1>
                        </div>

                        {/* Controls Section */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <motion.button
                                className="flex items-center justify-center gap-2 text-blue-950 font-bold bg-gray-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
                                onClick={() => navigate('/projects')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Globe className="w-5 h-5 text-[#FF4500]" />
                                My Websites
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-600">
                                    <BadgeDollarSign className="h-5 w-5" />
                                    Available Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-gray-900">
                                    {formatCurrency(balance?.availableBalance)}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Total available for withdrawal
                                </p>
                            </CardContent>
                        </Card>
            
                        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-600">
                                    <TrendingUp className="h-5 w-5" />
                                    Total Earnings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-gray-900">
                                    {formatCurrency(balance?.totalEarnings)}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Lifetime earnings
                                </p>
                            </CardContent>
                        </Card>
            
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(balance?.recentTransactions || []).slice(0, 3).map((transaction, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {transaction.type === 'credit' ? (
                                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium">{transaction.type}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                                </div>
                                            </div>
                                            <span className={`font-medium ${
                                                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {formatCurrency(transaction.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between"
                                    onClick={() => navigate('/transactions')}
                                >
                                    View All Transactions
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
            
                    {/* Business Earnings */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Business Earnings</h2>
                        {Object.entries(detailedBalance?.businessEarnings || {}).map(([businessName, data]) => (
                            <Card key={businessName} className="overflow-hidden">
                                <div
                                    onClick={() => setExpandedBusiness(expandedBusiness === businessName ? null : businessName)}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-orange-100">
                                                <Building2 className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <CardTitle>{businessName}</CardTitle>
                                                <CardDescription>{data.businessInfo.location}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-500">Total Earned</p>
                                                <p className="text-lg font-bold text-orange-600">{formatCurrency(data.totalAmount)}</p>
                                            </div>
                                            <ChevronRight className={`h-5 w-5 transition-transform ${
                                                expandedBusiness === businessName ? 'rotate-90' : ''
                                            }`} />
                                        </div>
                                    </div>
                                </CardHeader>
                                </div>
                
                                {expandedBusiness === businessName && (
                                    <CardContent className="pt-0">
                                        <div className="border-t border-gray-200 my-4" />
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="h-4 w-4" />
                                                        {data.businessInfo.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <LinkIcon className="h-4 w-4" />
                                                        <a href={data.businessInfo.link} target="_blank" rel="noopener noreferrer" 
                                                            className="text-blue-600 hover:underline">
                                                            Visit Website
                                                        </a>
                                                    </div>
                                                </div>
                            
                                                <div className="space-y-4">
                                                    {data.payments.map((payment) => (
                                                        <div key={payment.paymentReference} className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <div>
                                                                    <p className="font-medium">{formatDate(payment.paymentDate)}</p>
                                                                    <p className="text-sm text-gray-500">Ref: {payment.paymentReference}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-orange-600">
                                                                        {formatCurrency(payment.amount)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                
                                                            {!withdrawals[payment.paymentReference] ? (
                                                                <>
                                                                    {renderWithdrawButton(payment)}
                                                                </>
                                                            ) : (
                                                            <div className="space-y-3">
                                                                <input
                                                                    type="number"
                                                                    value={withdrawals[payment.paymentReference].amount}
                                                                    onChange={(e) => setWithdrawals(prev => ({
                                                                        ...prev,
                                                                        [payment.paymentReference]: {
                                                                            ...prev[payment.paymentReference],
                                                                            amount: e.target.value
                                                                        }
                                                                    }))}
                                                                    placeholder="Enter amount to withdraw"
                                                                    max={payment.amount}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                                />
                                                                <input
                                                                    type="tel"
                                                                    value={withdrawals[payment.paymentReference].phoneNumber}
                                                                    onChange={(e) => setWithdrawals(prev => ({
                                                                        ...prev,
                                                                        [payment.paymentReference]: {
                                                                            ...prev[payment.paymentReference],
                                                                            phoneNumber: e.target.value
                                                                        }
                                                                    }))}
                                                                    placeholder="Enter MoMo number"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                                />
                                                                {withdrawals[payment.paymentReference].error && (
                                                                    <Alert variant="destructive">
                                                                        <AlertDescription>
                                                                            {withdrawals[payment.paymentReference].error}
                                                                        </AlertDescription>
                                                                    </Alert>
                                                                )}
                                                                <div className="flex gap-3">
                                                                    <Button
                                                                        onClick={() => handleWithdrawSubmit(payment.paymentReference)}
                                                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                                                                    >
                                                                        Confirm Withdrawal
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => setWithdrawals(prev => ({
                                                                        ...prev,
                                                                        [payment.paymentReference]: undefined
                                                                        }))}
                                                                        className="flex-1"
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletComponent;