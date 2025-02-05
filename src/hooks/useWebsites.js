// hooks/useWebsites.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useWebsites(ownerId) {
  return useQuery({
    queryKey: ['websites', ownerId],
    queryFn: async () => {
      const response = await axios.get(`https://yepper-backend-test.onrender.com/api/websites/${ownerId}`);
      return response.data;
    },
    enabled: !!ownerId // Only run query if ownerId exists
  });
}