import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../contents/components/button';
import { Alert, AlertDescription } from '../contents/components/alert';
import {
  BadgeDollarSign,
  ChevronRight,
  Clock,
  Building2,
  Link as LinkIcon,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  DollarSign,
  InfoIcon
} from 'lucide-react';

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
    const [hoverCard1, setHoverCard1] = useState(false);
    const [hoverCard2, setHoverCard2] = useState(false);
    const [hoverCard3, setHoverCard3] = useState(false);

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

            const processedData = {
                ...data,
                monthlyEarnings: data.monthlyEarnings.map(month => ({
                  ...month,
                  payments: month.payments.map(payment => ({
                    ...payment,
                    _id: payment._id || payment.paymentReference // Ensure _id exists
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
            console.error('Error fetching balance:', err);
            setError('Unable to fetch wallet balance. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
  
    const handleWithdraw = async (businessName, paymentId, amount) => {
        console.log('Withdrawal initiated for:', { businessName, paymentId, amount });
        setWithdrawals(prev => ({
            ...prev,
            [paymentId]: {
                isWithdrawing: true,
                amount: amount || '', // Initialize with the passed amount
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
            currency: 'USD',
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
          if (!payment || !payment.paymentReference) {
            return {
              eligible: false,
              message: 'Invalid payment data'
            };
          }
      
          const response = await fetch(
            `http://localhost:5000/api/accept/check-eligibility/${payment.paymentReference}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
            console.log('Detailed Balance:', JSON.stringify(detailedBalance, null, 2));
            Object.values(detailedBalance.businessEarnings).forEach(business => {
                console.log('Business Payments:', JSON.stringify(business.payments, null, 2));
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
                <Button
                    disabled={true}
                    className="w-full bg-gray-400"
                >
                    <div className="flex items-center">
                        <InfoIcon className="h-4 w-4 mr-2" />
                        Checking eligibility...
                    </div>
                </Button>
            );
        }
      
        return (
            <Button
                onClick={() => handleWithdraw(payment.businessName, payment._id, payment.amount)}
                disabled={!eligibility?.eligible}
                className={`w-full ${
                eligibility?.eligible 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-400'
                }`}
            >
                {eligibility?.eligible ? (
                    <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Withdraw Funds
                    </>
                ) : (
                    <div className="flex items-center" title={eligibility?.message}>
                        <InfoIcon className="h-4 w-4 mr-2" />
                        {eligibility?.message || 'Not eligible for withdrawal'}
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
    <div className="min-h-screen bg-black text-white">
      {/* Ultra-modern header with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium tracking-wide">BACK</span>
          </button>
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">WALLET</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-24">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-blue-500 mr-6"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Financial Dashboard</span>
            <div className="h-px w-12 bg-blue-500 ml-6"></div>
          </div>
          
          <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Manage Your Finances
            </span>
          </h1>
          
          <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-6">
            Track your earnings, monitor transactions, and withdraw funds with ease.
          </p>
        </div>
        
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Available Balance Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverCard1 ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverCard1(true)}
            onMouseLeave={() => setHoverCard1(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <BadgeDollarSign className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="uppercase text-xs font-semibold text-blue-400 tracking-widest mb-1">Available</div>
                  <h2 className="text-2xl font-bold">Balance</h2>
                </div>
              </div>
              
              <div className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                {formatCurrency(balance?.availableBalance)}
              </div>
              
              <p className="text-white/70 mb-2">
                Total available for withdrawal
              </p>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-purple-900/30 to-purple-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverCard2 ? '0 0 40px rgba(147, 51, 234, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverCard2(true)}
            onMouseLeave={() => setHoverCard2(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="uppercase text-xs font-semibold text-purple-400 tracking-widest mb-1">Total</div>
                  <h2 className="text-2xl font-bold">Earnings</h2>
                </div>
              </div>
              
              <div className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                {formatCurrency(balance?.totalEarnings)}
              </div>
              
              <p className="text-white/70 mb-2">
                Lifetime earnings
              </p>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div 
            className="group relative backdrop-blur-md bg-gradient-to-b from-indigo-900/30 to-indigo-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500"
            style={{
              boxShadow: hoverCard3 ? '0 0 40px rgba(79, 70, 229, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
            onMouseEnter={() => setHoverCard3(true)}
            onMouseLeave={() => setHoverCard3(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-40"></div>
                  <div className="relative p-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400">
                    <Clock className="text-white" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="uppercase text-xs font-semibold text-indigo-400 tracking-widest mb-1">Recent</div>
                  <h2 className="text-2xl font-bold">Activity</h2>
                </div>
              </div>
              
              <div className="space-y-4 mb-4">
                {(balance?.recentTransactions || []).slice(0, 3).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {transaction.type === 'credit' ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <ArrowDownRight className="h-4 w-4 text-red-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white/80">{transaction.type === 'credit' ? 'Deposit' : 'Withdrawal'}</p>
                        <p className="text-xs text-white/60">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/transactions')}
                className="w-full group relative h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">View All Transactions</span>
                  <ChevronRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Business Earnings Section */}
        <div className="mb-12 max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Business Earnings</h2>
            <div className="h-px flex-grow bg-white/10 ml-4"></div>
          </div>
          
          <div className="space-y-6">
            {Object.entries(detailedBalance?.businessEarnings || {}).map(([businessName, data], index) => {
              const isEven = index % 2 === 0;
              const gradientFrom = isEven ? 'from-blue-900/30' : 'from-purple-900/30';
              const gradientTo = isEven ? 'to-blue-900/10' : 'to-purple-900/10';
              const hoverGradientFrom = isEven ? 'from-blue-600/10' : 'from-purple-600/10';
              const hoverGradientTo = isEven ? 'to-indigo-600/10' : 'to-indigo-600/10';
              const buttonGradientFrom = isEven ? 'from-blue-600' : 'from-purple-600';
              const buttonGradientTo = isEven ? 'to-indigo-600' : 'to-indigo-600';
              const buttonHoverFrom = isEven ? 'from-blue-400' : 'from-purple-400';
              const buttonHoverTo = isEven ? 'to-indigo-400' : 'to-indigo-400';
              const iconColor = isEven ? 'bg-blue-500' : 'bg-purple-500';
              const iconGradientFrom = isEven ? 'from-blue-600' : 'from-purple-600';
              const iconGradientTo = isEven ? 'to-blue-400' : 'to-purple-400';
              const textColor = isEven ? 'text-blue-400' : 'text-purple-400';
              
              return (
                <div 
                  key={businessName}
                  className={`group relative backdrop-blur-md bg-gradient-to-b ${gradientFrom} ${gradientTo} rounded-3xl overflow-hidden border border-white/10 transition-all duration-500`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${hoverGradientFrom} ${hoverGradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>
                  
                  <div 
                    className="p-8 relative z-10 cursor-pointer"
                    onClick={() => setExpandedBusiness(expandedBusiness === businessName ? null : businessName)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className={`absolute inset-0 rounded-full ${iconColor} blur-md opacity-40`}></div>
                          <div className={`relative p-3 rounded-full bg-gradient-to-r ${iconGradientFrom} ${iconGradientTo}`}>
                            <Building2 className="text-white" size={24} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className={`uppercase text-xs font-semibold ${textColor} tracking-widest mb-1`}>Business</div>
                          <h2 className="text-2xl font-bold">{businessName}</h2>
                          <p className="text-white/60 text-sm">{data.businessInfo.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white/60">Total Earned</p>
                          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">{formatCurrency(data.totalAmount)}</p>
                        </div>
                        <ChevronRight className={`h-5 w-5 transition-transform ${
                          expandedBusiness === businessName ? 'rotate-90' : ''
                        } text-white/60`} />
                      </div>
                    </div>
                    
                    {expandedBusiness === businessName && (
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                          <div className="flex items-center gap-2 text-white/70">
                            <Mail className="h-4 w-4" />
                            {data.businessInfo.email}
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <LinkIcon className="h-4 w-4" />
                            <a href={data.businessInfo.link} target="_blank" rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 transition-colors">
                              Visit Website
                            </a>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {data.payments.map((payment) => (
                            <div key={payment._id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                              <div className="flex justify-between items-center mb-6">
                                <div>
                                  <p className="font-medium text-white">{formatDate(payment.paymentDate)}</p>
                                  <p className="text-sm text-white/60">Ref: {payment.paymentReference}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                                    {formatCurrency(payment.amount)}
                                  </p>
                                </div>
                              </div>
                              
                              {!withdrawals[payment._id] ? (
                                <>
                                  {renderWithdrawButton(payment)}
                                </>
                              ) : (
                                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="number"
                                    value={withdrawals[payment._id].amount}
                                    onChange={(e) => setWithdrawals(prev => ({
                                      ...prev,
                                      [payment._id]: {
                                        ...prev[payment._id],
                                        amount: e.target.value
                                      }
                                    }))}
                                    placeholder="Enter amount to withdraw"
                                    max={payment.amount}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-white/50"
                                  />
                                  <input
                                    type="tel"
                                    value={withdrawals[payment._id].phoneNumber}
                                    onChange={(e) => setWithdrawals(prev => ({
                                      ...prev,
                                      [payment._id]: {
                                        ...prev[payment._id],
                                        phoneNumber: e.target.value
                                      }
                                    }))}
                                    placeholder="Enter MoMo number"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-white/50"
                                  />
                                  {withdrawals[payment._id].error && (
                                    <Alert variant="destructive" className="bg-red-900/50 border border-red-500/50 text-white">
                                      <AlertDescription>
                                        {withdrawals[payment._id].error}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                  <div className="flex gap-4">
                                    <button
                                      onClick={() => handleWithdrawSubmit(payment._id)}
                                      className={`flex-1 group relative h-12 rounded-xl bg-gradient-to-r ${buttonGradientFrom} ${buttonGradientTo} text-white font-medium overflow-hidden transition-all duration-300`}
                                    >
                                      <div className={`absolute inset-0 bg-gradient-to-r ${buttonHoverFrom} ${buttonHoverTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                      <span className="relative z-10 flex items-center justify-center">
                                        <span>Confirm Withdrawal</span>
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => setWithdrawals(prev => ({
                                        ...prev,
                                        [payment._id]: undefined
                                      }))}
                                      className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white font-medium"
                                    >
                                      <span className="flex items-center justify-center">
                                        <span>Cancel</span>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletComponent;