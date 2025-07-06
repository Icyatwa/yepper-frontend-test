// hooks/useApi.js
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiClient, { setupApiInterceptors } from '../utils/axiosConfig';

export const useApi = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn && getToken) {
      setupApiInterceptors(getToken);
    }
  }, [getToken, isSignedIn]);

  return apiClient;
};

export default useApi;