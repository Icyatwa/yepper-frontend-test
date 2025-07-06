// components/ApiSetup.js
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupApiInterceptors } from '../utils/apiClient';

function ApiSetup({ children }) {
  const { getToken } = useAuth();
  
  useEffect(() => {
    if (getToken) {
      setupApiInterceptors(getToken);
    }
  }, [getToken]);

  return children;
}

export default ApiSetup;