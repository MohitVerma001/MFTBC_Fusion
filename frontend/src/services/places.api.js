/**
 * Places API - All place-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const placesApi = {
  // Get all places
  getAll: async () => {
    return httpService.get('/api/places');
  },

  // Get place by ID
  getById: async (id) => {
    return httpService.get(`/api/places/${id}`);
  },

  // Create new place
  create: async (placeData) => {
    return httpService.post('/api/places', placeData);
  },

  // Update place
  update: async (id, placeData) => {
    return httpService.put(`/api/places/${id}`, placeData);
  },

  // Delete place
  delete: async (id) => {
    return httpService.delete(`/api/places/${id}`);
  },

  // Search places
  search: async (query) => {
    return httpService.get(`/api/places?search=${encodeURIComponent(query)}`);
  },
};

export default placesApi;
