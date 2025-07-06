import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Home } from 'lucide-react';

const statusMessages = {
    'invalid-params': {
        title: 'Invalid Parameters',
        description: 'The payment process failed due to missing or invalid parameters.',
        icon: AlertCircle,
        color: 'text-yellow-400',
        bgColor: 'from-yellow-900/30 to-yellow-900/10',
        gradientAccent: 'from-yellow-600/10 to-amber-600/10',
        buttonGradient: 'from-yellow-600 to-amber-600',
        buttonHoverGradient: 'from-yellow-400 to-amber-400',
        glow: 'rgba(234, 179, 8, 0.3)'
    },
    'invalid-txref': {
        title: 'Invalid Transaction Reference',
        description: 'The transaction reference provided is invalid or malformed.',
        icon: AlertCircle,
        color: 'text-yellow-400',
        bgColor: 'from-yellow-900/30 to-yellow-900/10',
        gradientAccent: 'from-yellow-600/10 to-amber-600/10',
        buttonGradient: 'from-yellow-600 to-amber-600',
        buttonHoverGradient: 'from-yellow-400 to-amber-400',
        glow: 'rgba(234, 179, 8, 0.3)'
    },
    'payment-not-found': {
        title: 'Payment Not Found',
        description: 'We could not locate the payment record in our system.',
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'from-red-900/30 to-red-900/10',
        gradientAccent: 'from-red-600/10 to-rose-600/10',
        buttonGradient: 'from-red-600 to-rose-600',
        buttonHoverGradient: 'from-red-400 to-rose-400',
        glow: 'rgba(225, 29, 72, 0.3)'
    },
    'amount-mismatch': {
        title: 'Amount Mismatch',
        description: 'The payment amount does not match the expected amount.',
        icon: AlertCircle,
        color: 'text-yellow-400',
        bgColor: 'from-yellow-900/30 to-yellow-900/10',
        gradientAccent: 'from-yellow-600/10 to-amber-600/10',
        buttonGradient: 'from-yellow-600 to-amber-600',
        buttonHoverGradient: 'from-yellow-400 to-amber-400',
        glow: 'rgba(234, 179, 8, 0.3)'
    },
    'success': {
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
        icon: CheckCircle2,
        color: 'text-green-400',
        bgColor: 'from-green-900/30 to-green-900/10',
        gradientAccent: 'from-green-600/10 to-emerald-600/10',
        buttonGradient: 'from-green-600 to-emerald-600',
        buttonHoverGradient: 'from-green-400 to-emerald-400',
        glow: 'rgba(16, 185, 129, 0.3)'
    },
    'failed': {
        title: 'Payment Failed',
        description: 'The payment process could not be completed. Please try again.',
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'from-red-900/30 to-red-900/10',
        gradientAccent: 'from-red-600/10 to-rose-600/10',
        buttonGradient: 'from-red-600 to-rose-600',
        buttonHoverGradient: 'from-red-400 to-rose-400',
        glow: 'rgba(225, 29, 72, 0.3)'
    },
    'error': {
        title: 'System Error',
        description: 'An unexpected error occurred. Please contact support if this persists.',
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'from-red-900/30 to-red-900/10',
        gradientAccent: 'from-red-600/10 to-rose-600/10',
        buttonGradient: 'from-red-600 to-rose-600',
        buttonHoverGradient: 'from-red-400 to-rose-400',
        glow: 'rgba(225, 29, 72, 0.3)'
    }
};

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const paymentStatus = searchParams.get('status');
        setStatus(paymentStatus);
    }, [searchParams]);

    if (!status || !statusMessages[status]) {
        return null;
    }

    const { 
        title, 
        description, 
        icon: Icon, 
        color, 
        bgColor, 
        gradientAccent, 
        buttonGradient, 
        buttonHoverGradient,
        glow 
    } = statusMessages[status];

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
                    <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">PAYMENT</div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-lg mx-auto">
                    <div 
                        className="group relative backdrop-blur-md bg-gradient-to-b"
                        style={{
                            boxShadow: hover ? `0 0 40px ${glow}` : '0 0 0 rgba(0, 0, 0, 0)'
                        }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <div 
                            className={`rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 bg-gradient-to-b ${bgColor}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${gradientAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>
                            
                            <div className="p-10 relative z-10">
                                <div className="flex flex-col items-center mb-8 text-center">
                                    <div className="relative mb-6">
                                        <div className={`absolute inset-0 rounded-full ${color} blur-md opacity-40`}></div>
                                        <div className={`relative p-4 rounded-full bg-white/10`}>
                                            <Icon className={`${color}`} size={32} />
                                        </div>
                                    </div>
                                    
                                    <div className="uppercase text-xs font-semibold tracking-widest mb-2 text-white/70">
                                        Transaction ID: {searchParams.get('txref') || 'N/A'}
                                    </div>
                                    <h2 className="text-3xl font-bold">{title}</h2>
                                    <p className="text-white/70 mt-4">
                                        {description}
                                    </p>
                                </div>
                                
                                <div className="space-y-4 mt-12">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className={`w-full group relative h-16 rounded-xl bg-gradient-to-r ${buttonGradient} text-white font-medium overflow-hidden transition-all duration-300`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${buttonHoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                        <span className="relative z-10 flex items-center justify-center">
                                            <Home size={16} className="mr-2" />
                                            <span className="uppercase tracking-wider">Return to Dashboard</span>
                                        </span>
                                    </button>
                                    
                                    {status !== 'success' && (
                                        <button 
                                            onClick={() => navigate(-1)}
                                            className="w-full group relative h-16 rounded-xl bg-white/5 border border-white/10 text-white font-medium overflow-hidden transition-all duration-300 hover:bg-white/10"
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                <ArrowLeft size={16} className="mr-2" />
                                                <span className="uppercase tracking-wider">Try Again</span>
                                            </span>
                                        </button>
                                    )}
                                </div>

                                {status !== 'success' && (
                                    <p className="text-center text-sm text-white/50 mt-8">
                                        Need help? <a href="/support" className={`${color} hover:text-white transition-colors`}>Contact our support team</a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentStatus;