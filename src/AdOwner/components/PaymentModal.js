import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PaymentModal = ({ ad, websiteId, onClose }) => {
    const { user, token } = useAuth();
    const [email, setEmail] = useState('icyatwandoba@gmail.com');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hover, setHover] = useState(false);
    
    // Fix: Get userId from user object properly
    const userId = user?.id || user?._id || user?.userId;

    const initiatePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Enhanced validation
            if (!ad?._id || !websiteId) {
                setError('Missing ad or website information');
                setLoading(false);
                return;
            }

            if (!userId) {
                setError('User authentication required. Please log in again.');
                setLoading(false);
                return;
            }

            // Find the correct website status based on websiteId
            const websiteSelection = ad.websiteStatuses?.find(
                status => status.websiteId === websiteId
            ) || ad.websiteSelections?.find(
                selection => selection.websiteId === websiteId || selection.websiteId._id === websiteId
            );

            if (!websiteSelection) {
                setError('Website selection not found');
                setLoading(false);
                return;
            }

            // Calculate total price from categories
            const totalPrice = websiteSelection.categories?.reduce(
                (sum, cat) => sum + (cat.price || 0), 0
            ) || 0;

            if (totalPrice <= 0) {
                setError('Invalid payment amount');
                setLoading(false);
                return;
            }

            console.log('Initiating payment with data:', {
                adId: ad._id,
                websiteId,
                amount: totalPrice,
                email,
                userId
            });

            const response = await axios.post('http://localhost:5000/api/web-advertise/initiate-payment', {
                adId: ad._id,
                websiteId,
                amount: totalPrice,
                email: email || undefined,
                userId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });

            if (response.data.success && response.data.paymentLink) {
                // Redirect to payment link
                window.location.href = response.data.paymentLink;
            } else {
                setError(response.data.message || 'Payment link generation failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const websiteSelection = ad?.websiteStatuses?.find(
        status => status.websiteId === websiteId
    ) || ad?.websiteSelections?.find(
        selection => selection.websiteId === websiteId || selection.websiteId._id === websiteId
    );

    const totalPrice = websiteSelection?.categories?.reduce(
        (sum, cat) => sum + (cat.price || 0), 0
    ) || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>

                <div className="mb-4">
                    <div className="text-sm text-gray-600">
                        <p>Business: {ad?.businessName}</p>
                        <p>Total Amount: ${totalPrice}</p>
                        <p>Categories: {websiteSelection?.categories?.length || 0}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={initiatePayment}
                        disabled={loading || !email || !userId}
                        className={`flex-1 px-4 py-2 rounded-md text-white font-medium ${
                            loading || !email || !userId
                                ? 'bg-gray-400 cursor-not-allowed'
                                : hover
                                ? 'bg-blue-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } transition-colors`}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        {loading ? 'Processing...' : `Pay $${totalPrice}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;