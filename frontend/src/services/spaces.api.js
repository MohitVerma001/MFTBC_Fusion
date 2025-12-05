/**
 * Spaces API - All spaces-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const spacesApi = {
  // Get all spaces
  getAll: async () => {
    return httpService.get('/api/spaces');
  },

  // Get space by ID
  getById: async (id) => {
    return httpService.get(`/api/spaces/${id}`);
  },

  // Create new space
  create: async (spaceData) => {
    return httpService.post('/api/spaces', spaceData);
  },

  // Update space
  update: async (id, spaceData) => {
    return httpService.put(`/api/spaces/${id}`, spaceData);
  },

  // Delete space
  delete: async (id) => {
    return httpService.delete(`/api/spaces/${id}`);
  },

  // Get subspaces for a space
  getSubspaces: async (spaceId) => {
    return httpService.get(`/api/spaces/${spaceId}/subspaces`);
  },

  // Create subspace
  createSubspace: async (subspaceData) => {
    return httpService.post('/api/subspaces', subspaceData);
  },

  // Update subspace
  updateSubspace: async (id, subspaceData) => {
    return httpService.put(`/api/subspaces/${id}`, subspaceData);
  },

  // Delete subspace
  deleteSubspace: async (id) => {
    return httpService.delete(`/api/subspaces/${id}`);
  },
};

export default spacesApi;
