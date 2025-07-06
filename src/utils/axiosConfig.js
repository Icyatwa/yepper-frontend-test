// utils/apiClient.js
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://yepper-backend.onrender.com' 
  : 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupApiInterceptors = (getToken) => {
  // Clear existing interceptors
  apiClient.interceptors.request.clear();
  apiClient.interceptors.response.clear();

  // Request interceptor
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        console.error('Error getting token:', error);
        return config;
      }
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await getToken({ skipCache: true });
          
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return apiClient(originalRequest);
          } else {
            throw new Error('No token received');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          
          const currentPath = window.location.pathname;
          const publicRoutes = ['/', '/sign-in', '/sign-up', '/yepper-ads', '/yepper-spaces', '/videos', '/pricing', '/terms', '/privacy'];
          
          if (!publicRoutes.includes(currentPath)) {
            window.location.href = '/sign-in';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export default apiClient;