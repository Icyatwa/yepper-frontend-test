// PollingPayment.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PollingPayment = ({ paymentData, onSuccess, onFailed }) => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 30; // 30 attempts = 5 minutes

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    if (!paymentData.tx_ref) return;

    const pollPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/web-advertise/payment/poll-status?tx_ref=${paymentData.tx_ref}`,
          { headers: getAuthHeaders() }
        );

        if (response.data.status === 'completed') {
          setStatus('success');
          setMessage('Payment completed successfully!');
          if (onSuccess) onSuccess(response.data);
          return;
        }

        if (response.data.status === 'failed') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
          if (onFailed) onFailed(response.data);
          return;
        }

        // Still pending
        setPollCount(prev => prev + 1);
        if (pollCount >= maxPolls) {
          setStatus('timeout');
          setMessage('Payment verification timed out. Please check your dashboard.');
          return;
        }

        setMessage(`Waiting for payment confirmation... (${pollCount + 1}/${maxPolls})`);

      } catch (error) {
        console.error('Polling error:', error);
        setStatus('error');
        setMessage('Error checking payment status');
      }
    };

    // Start polling every 10 seconds
    const interval = setInterval(pollPaymentStatus, 10000);
    
    // Initial check after 5 seconds
    const initialCheck = setTimeout(pollPaymentStatus, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialCheck);
    };
  }, [paymentData.tx_ref, pollCount, onSuccess, onFailed]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="text-sm text-gray-500">
              Payment Amount: ${paymentData.amount?.toFixed(2)}
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">Success!</h3>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {(status === 'failed' || status === 'error' || status === 'timeout') && (
          <>
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              {status === 'timeout' ? 'Timeout' : 'Error'}
            </h3>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PollingPayment;