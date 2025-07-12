import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await axios.get(`/api/auth/verify-email?token=${token}`);
      setStatus('success');
      setMessage('Email verified successfully! You can now log in.');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  const resendVerification = async () => {
    if (!email) return;
    
    setResendLoading(true);
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'verifying' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          )}
          
          {status === 'success' && (
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
          )}
          
          {status === 'error' && (
            <XCircle className="mx-auto h-12 w-12 text-red-400" />
          )}
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'verifying' ? 'Verifying Email...' : 'Email Verification'}
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
        </div>

        {status === 'success' && (
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={resendVerification}
              disabled={resendLoading || !email}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              {resendLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;