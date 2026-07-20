import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

// Determine Base URL (defaulting to localhost:3000 as discussed)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    // Get token directly from Zustand store
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Network unavailable');
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        // Clear auth state and potentially redirect to login
        useAuthStore.getState().logout();
        break;
      case 403:
        toast.error('Permission denied');
        break;
      case 429:
        toast.warning('Too many requests');
        break;
      case 500:
        toast.error('Server error');
        break;
    }

    return Promise.reject(error);
  }
);
