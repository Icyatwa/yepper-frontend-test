import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { X, CreditCard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PaymentModal = ({ ad, websiteId, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hover, setHover] = useState(false);
    const { user } = useClerk();
    const userId = user?.id;

    const initiatePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const websiteSelection = ad.websiteStatuses.find(
                status => status.websiteId === websiteId
            );

            const totalPrice = websiteSelection.categories.reduce(
                (sum, cat) => sum + cat.price, 0
            );

            const response = await axios.post('http://localhost:5000/api/accept/initiate-payment', {
                adId: ad._id,
                websiteId,
                amount: totalPrice,
                email,
                userId
            });

            if (response.data.paymentLink) {
                window.location.href = response.data.paymentLink;
            } else {
                setError('Payment link generation failed. Please try again.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-md mx-4 overflow-hidden"
                style={{
                    boxShadow: hover ? '0 0 40px rgba(249, 115, 22, 0.3)' : '0 0 20px rgba(0, 0, 0, 0)'
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div className="group relative backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                    
                    <div className="p-8 relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                                    <div className="relative p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                                        <CreditCard className="text-white" size={20} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="uppercase text-xs font-semibold text-orange-400 tracking-widest mb-1">Secure</div>
                                    <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                                </div>
                            </div>
                            
                            <button 
                                onClick={onClose}
                                className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-5 w-5 text-white/70 hover:text-white" />
                            </button>
                        </div>
                    
                        <div className="space-y-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 uppercase tracking-wide">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 px-4 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-colors text-white"
                                    placeholder="Enter your email"
                                    required 
                                />
                            </div>

                            <div className="flex items-center text-white/60 text-sm">
                                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                                    <Shield size={12} className="text-orange-400" />
                                </div>
                                <span>Your payment information is secured with end-to-end encryption</span>
                            </div>

                            {error && (
                                <div className="text-rose-400 text-sm p-3 bg-rose-500/20 border border-rose-500/20 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>
                    
                        <motion.button
                            className="w-full group relative h-14 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={initiatePayment}
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? 
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        PROCESSING
                                    </span> 
                                    : 
                                    <span className="uppercase tracking-wider">COMPLETE PAYMENT</span>
                                }
                            </span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentModal;