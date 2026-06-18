import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Container } from '../components/components';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setMessage('');

  try {
    // CHANGE THIS LINE - use local backend
        const response = await fetch(`/api/password/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage(data.message);
      setEmail('');
    } else {
      setError(data.message);
    }
  } catch (error) {
    setError('Cannot connect to server. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <header className="yp-inner-header">
        <Container>
          <div className="h-16 flex items-center justify-between">
            <Link to='/login'>
              <button 
                className="yp-back-btn"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
          </div>
        </Container>
      </header>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-12 flex justify-center items-center">
            <h2 className="yp-bricolage text-3xl font-bold" style={{color:"var(--yp-ink)",letterSpacing:"-.025em"}}>Reset your password</h2>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm text-center">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-black">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="yp-input"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-black hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;