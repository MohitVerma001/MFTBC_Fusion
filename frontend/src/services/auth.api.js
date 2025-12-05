/**
 * Auth API - Authentication-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const authApi = {
  // Login
  login: async (credentials) => {
    return httpService.post('/api/auth/login', credentials);
  },

  // Logout
  logout: async () => {
    return httpService.post('/api/auth/logout');
  },

  // Register
  register: async (userData) => {
    return httpService.post('/api/auth/register', userData);
  },

  // Get current user
  getCurrentUser: async () => {
    return httpService.get('/api/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return httpService.put('/api/auth/profile', profileData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return httpService.post('/api/auth/change-password', passwordData);
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return httpService.post('/api/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    return httpService.post('/api/auth/reset-password', { token, password: newPassword });
  },

  // Verify email
  verifyEmail: async (token) => {
    return httpService.post('/api/auth/verify-email', { token });
  },
};

export default authApi;
