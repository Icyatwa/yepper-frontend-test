// hooks/useMixedAds.js
import { useQuery } from '@tanstack/react-query';

export function useMixedAds(userId) {
  return useQuery({
    queryKey: ['mixedAds', userId],
    queryFn: async () => {
      const response = await fetch(`https://yepper-backend-test.onrender.com/api/accept/mixed/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }
      return response.json();
    },
    enabled: !!userId
  });
}