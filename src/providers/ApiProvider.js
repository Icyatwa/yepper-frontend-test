// providers/ApiProvider.js
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupApiInterceptors } from '../utils/axiosConfig';

export const ApiProvider = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn && getToken) {
      console.log('Setting up API interceptors...');
      setupApiInterceptors(getToken);
    }
  }, [getToken, isSignedIn]);

  return <>{children}</>;
};