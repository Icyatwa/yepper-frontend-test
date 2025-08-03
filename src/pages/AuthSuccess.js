import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Simulate getting user data (in real app, you'd decode the token or fetch user data)
      login({ token, user: { name: 'Google User', email: 'user@example.com' } });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl"/>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;