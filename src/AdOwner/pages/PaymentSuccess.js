// PaymentSuccess.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking payment status...');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const txRef = searchParams.get('tx_ref');
      const paymentId = searchParams.get('payment_id');
      const flwStatus = searchParams.get('status');
      
      // If Flutterwave already says it failed, don't bother checking
      if (flwStatus === 'cancelled' || flwStatus === 'failed') {
        setStatus('failed');
        setMessage('Payment was cancelled or failed');
        return;
      }

      if (!txRef && !paymentId) {
        setStatus('error');
        setMessage('No payment reference found');
        return;
      }

      try {
        // Use direct check method instead of problematic callback verification
        const response = await axios.post(
          'http://localhost:5000/api/web-advertise/payment/check-direct',
          { tx_ref: txRef },
          { headers: getAuthHeaders() }
        );

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message || 'Payment successful! Your ad is now live.');
        } else {
          setStatus('failed');
          setMessage(response.data.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment check error:', error);
        setStatus('failed');
        setMessage('Unable to verify payment. Please check your dashboard or contact support.');
      }
    };

    // Small delay to ensure URL params are loaded
    const timer = setTimeout(checkPaymentStatus, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'checking' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Checking Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/my-ads')}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              View My Ads
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/my-ads')}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Return to My Ads
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">Unable to Verify</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/my-ads')}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Check Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;