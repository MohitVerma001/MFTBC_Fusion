/**
 * Categories API - All category-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    return httpService.get('/api/categories');
  },

  // Get category by ID
  getById: async (id) => {
    return httpService.get(`/api/categories/${id}`);
  },

  // Create new category
  create: async (categoryData) => {
    return httpService.post('/api/categories', categoryData);
  },

  // Update category
  update: async (id, categoryData) => {
    return httpService.put(`/api/categories/${id}`, categoryData);
  },

  // Delete category
  delete: async (id) => {
    return httpService.delete(`/api/categories/${id}`);
  },

  // Get categories with blog count
  getWithBlogCount: async () => {
    return httpService.get('/api/categories?include_count=true');
  },
};

export default categoriesApi;
