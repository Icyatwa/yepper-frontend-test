// hooks/useTokenManager.js
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

export const useTokenManager = () => {
  const { getToken, isSignedIn } = useAuth();
  const [currentToken, setCurrentToken] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef(null);
  const tokenRef = useRef(null);

  // Function to get a fresh token
  const getFreshToken = async (forceRefresh = false) => {
    if (!isSignedIn) return null;

    try {
      setIsRefreshing(true);
      
      // Get token with template specified to ensure fresh token
      const token = await getToken({ 
        template: 'default',
        // Force refresh if requested or if no current token
        skipCache: forceRefresh || !tokenRef.current
      });
      
      if (token) {
        setCurrentToken(token);
        tokenRef.current = token;
      }
      
      return token;
    } catch (error) {
      console.error('Error getting fresh token:', error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to check if token needs refresh (proactive refresh)
  const shouldRefreshToken = (token) => {
    if (!token) return true;

    try {
      // Decode JWT to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Refresh if token expires in the next 30 seconds
      return (payload.exp - currentTime) < 30;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Set up automatic token refresh
  useEffect(() => {
    if (!isSignedIn) {
      setCurrentToken(null);
      tokenRef.current = null;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      return;
    }

    // Get initial token
    getFreshToken();

    // Set up interval to check and refresh token every 30 seconds
    refreshIntervalRef.current = setInterval(async () => {
      if (tokenRef.current && shouldRefreshToken(tokenRef.current)) {
        console.log('Proactively refreshing token');
        await getFreshToken(true);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isSignedIn]);

  // Function to get current valid token
  const getValidToken = async () => {
    if (!isSignedIn) return null;

    // If no current token or it needs refresh, get a fresh one
    if (!tokenRef.current || shouldRefreshToken(tokenRef.current)) {
      return await getFreshToken(true);
    }

    return tokenRef.current;
  };

  return {
    currentToken,
    isRefreshing,
    getFreshToken,
    getValidToken,
    shouldRefreshToken
  };
};