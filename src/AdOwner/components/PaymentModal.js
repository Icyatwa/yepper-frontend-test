// PaymentModal.js - Fixed version
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PaymentModal = ({ ad, websiteId, onClose }) => {
    const { user, token } = useAuth();
    const [email, setEmail] = useState('icyatwandoba@gmail.com');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
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

            // Debug: Check token availability
            console.log('Token available:', !!token);
            console.log('User ID:', userId);

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

            // FIX: Ensure proper headers are set
            const requestConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Add Authorization header only if token exists
            if (token) {
                requestConfig.headers.Authorization = `Bearer ${token}`;
            }

            console.log('Request headers:', requestConfig.headers);

            const response = await axios.post('http://localhost:5000/api/web-advertise/initiate-payment', {
                adId: ad._id,
                websiteId,
                amount: totalPrice,
                email: email || undefined,
                userId
            }, requestConfig);

            if (response.data.success && response.data.paymentLink) {
                // Redirect to payment link
                window.location.href = response.data.paymentLink;
            } else {
                setError(response.data.message || 'Payment link generation failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            console.error('Error response:', error.response?.data);
            
            // Enhanced error handling
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Authentication failed. Please log in again.';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.message || 'Invalid request data.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={initiatePayment}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                    
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
                
                {/* Debug info - remove in production */}
                <div className="mt-4 text-xs text-gray-500">
                    <p>Debug: User ID: {userId}</p>
                    <p>Debug: Token: {token ? 'Present' : 'Missing'}</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;