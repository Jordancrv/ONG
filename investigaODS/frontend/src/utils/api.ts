import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

console.log('🔧 API Base URL:', API_BASE_URL || '(usando proxy relativo)');

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api', // Siempre usar /api para aprovechar el proxy de Vite
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for JWT refresh tokens
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // No intentar refresh si ya estamos en login o si el request es a login/register
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/register') ||
                          originalRequest.url?.includes('/auth/refresh');
    
    const isLoginPage = window.location.pathname === '/login';

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          '/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        
        // Save new token
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login (solo si no estamos ya en login)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('investiga_user');
        localStorage.removeItem('investiga_plan');
        
        if (!isLoginPage) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
