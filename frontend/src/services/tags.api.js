/**
 * Tags API - All tag-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const tagsApi = {
  // Get all tags
  getAll: async () => {
    return httpService.get('/api/tags');
  },

  // Get tag by ID
  getById: async (id) => {
    return httpService.get(`/api/tags/${id}`);
  },

  // Create new tag
  create: async (tagData) => {
    return httpService.post('/api/tags', tagData);
  },

  // Update tag
  update: async (id, tagData) => {
    return httpService.put(`/api/tags/${id}`, tagData);
  },

  // Delete tag
  delete: async (id) => {
    return httpService.delete(`/api/tags/${id}`);
  },

  // Search tags by name
  search: async (query) => {
    return httpService.get(`/api/tags?search=${encodeURIComponent(query)}`);
  },
};

export default tagsApi;
