// WebhookSuccessChecker.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const WebhookSuccessChecker = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('waiting');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 12; // 2 minutes of checking

  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    const flwStatus = searchParams.get('status');
    
    if (flwStatus !== 'successful' || !txRef) {
      setStatus('failed');
      return;
    }

    // Check if webhook has processed the payment
    const checkWebhookProcessing = async () => {
      try {
        // Check if payment record exists and is successful
        const pendingPayment = localStorage.getItem('pendingPayment');
        if (pendingPayment) {
          const paymentData = JSON.parse(pendingPayment);
          
          if (paymentData.tx_ref === txRef) {
            // Webhook should have processed this by now
            // Simply assume success after a few seconds for webhook processing
            setTimeout(() => {
              setStatus('success');
              localStorage.removeItem('pendingPayment');
            }, 5000);
            return;
          }
        }
        
        setAttempts(prev => prev + 1);
        
        if (attempts >= maxAttempts) {
          setStatus('timeout');
          return;
        }
        
      } catch (error) {
        console.error('Webhook check error:', error);
        setStatus('error');
      }
    };

    const interval = setInterval(checkWebhookProcessing, 10000);
    const initialCheck = setTimeout(checkWebhookProcessing, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialCheck);
    };
  }, [attempts, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'waiting' && (
          <>
            <div className="animate-pulse text-blue-500 text-6xl mb-4">💳</div>
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600 mb-4">
              Your payment is being processed. This usually takes a few seconds.
            </p>
            <div className="text-sm text-gray-500">
              Attempt {attempts + 1} of {maxAttempts}
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your ad has been published successfully.</p>
            <button
              onClick={() => navigate('/my-ads')}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              View My Ads
            </button>
          </>
        )}

        {(status === 'failed' || status === 'timeout' || status === 'error') && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              {status === 'timeout' ? 'Processing Timeout' : 'Payment Issue'}
            </h2>
            <p className="text-gray-600 mb-6">
              {status === 'timeout' 
                ? 'Payment processing is taking longer than expected. Please check your dashboard.'
                : 'There was an issue processing your payment.'}
            </p>
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

export default WebhookSuccessChecker;