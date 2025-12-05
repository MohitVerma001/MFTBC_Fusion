import httpService from './http.service.js';

export const spacesApi = {
  getAll: async (queryString = '') => {
    return httpService.get(`/api/subspaces${queryString}`);
  },

  getById: async (id) => {
    return httpService.get(`/api/subspaces/${id}`);
  },

  create: async (spaceData) => {
    return httpService.post('/api/subspaces', spaceData);
  },

  update: async (id, spaceData) => {
    return httpService.put(`/api/subspaces/${id}`, spaceData);
  },

  delete: async (id) => {
    return httpService.delete(`/api/subspaces/${id}`);
  },

  getSubspaces: async (queryString = '') => {
    return httpService.get(`/api/subspaces${queryString}`);
  },

  getRootSpaces: async () => {
    return httpService.get('/api/subspaces/root');
  },

  getChildSpaces: async (parentId) => {
    return httpService.get(`/api/subspaces/${parentId}/children`);
  },

  getSpaceHierarchy: async (id) => {
    return httpService.get(`/api/subspaces/${id}/hierarchy`);
  }
};

export default spacesApi;
