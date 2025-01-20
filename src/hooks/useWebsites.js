// hooks/useWebsites.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useWebsites(ownerId) {
  return useQuery({
    queryKey: ['websites', ownerId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/websites/${ownerId}`);
      return response.data;
    },
    enabled: !!ownerId // Only run query if ownerId exists
  });
}