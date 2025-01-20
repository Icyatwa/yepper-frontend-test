// PaymentModal.js
import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import {
    X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PaymentModal = ({ ad, websiteId, onClose }) => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useClerk();
    const userId = user?.id;

    const initiatePayment = async () => {
        setLoading(true);
        setError(null);
  
        try {
            // Find the website selection and calculate total price
            const websiteSelection = ad.websiteStatuses.find(
                status => status.websiteId === websiteId
            );
  
            const totalPrice = websiteSelection.categories.reduce(
                (sum, cat) => sum + cat.price, 0
            );
  
            // Fix: Update the API endpoint to match the server route
            const response = await axios.post('http://localhost:5000/api/accept/initiate-payment', {
                adId: ad._id,
                websiteId,
                amount: totalPrice,
                email,
                phoneNumber,
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

    // Return the modal JSX (your existing modal code)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Enter Your Details to Proceed with Payment
                        </h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email:
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number:
                            </label>
                            <input 
                                type="tel" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required 
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                
                        <motion.button
                            className="flex items-center w-full justify-center text-white px-3 py-2 rounded-lg text-sm font-bold sm:text-base bg-[#FF4500] hover:bg-orange-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={initiatePayment}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Proceed with Payment'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal