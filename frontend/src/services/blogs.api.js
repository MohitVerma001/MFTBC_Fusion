/**
 * Blogs API - All blog/news-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const blogsApi = {
  // Get all blogs with optional filters
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/blogs?${queryString}` : '/api/blogs';
    return httpService.get(endpoint);
  },

  // Get blog by ID
  getById: async (id) => {
    return httpService.get(`/api/blogs/${id}`);
  },

  // Create new blog
  create: async (blogData) => {
    return httpService.post('/api/blogs', blogData);
  },

  // Update blog
  update: async (id, blogData) => {
    return httpService.put(`/api/blogs/${id}`, blogData);
  },

  // Delete blog
  delete: async (id) => {
    return httpService.delete(`/api/blogs/${id}`);
  },

  // Get blogs by category
  getByCategory: async (categoryId) => {
    return httpService.get(`/api/blogs?category=${categoryId}`);
  },

  // Get blogs by tag
  getByTag: async (tagId) => {
    return httpService.get(`/api/blogs?tag=${tagId}`);
  },

  // Get featured blogs
  getFeatured: async () => {
    return httpService.get('/api/blogs?featured=true');
  },

  // Get latest blogs
  getLatest: async (limit = 10) => {
    return httpService.get(`/api/blogs?limit=${limit}&sort=created_at:desc`);
  },

  // Like a blog
  like: async (id) => {
    return httpService.post(`/api/blogs/${id}/like`);
  },

  // Unlike a blog
  unlike: async (id) => {
    return httpService.delete(`/api/blogs/${id}/like`);
  },

  // Get blog comments
  getComments: async (id) => {
    return httpService.get(`/api/blogs/${id}/comments`);
  },

  // Add comment to blog
  addComment: async (id, commentData) => {
    return httpService.post(`/api/blogs/${id}/comments`, commentData);
  },

  // Update comment
  updateComment: async (blogId, commentId, commentData) => {
    return httpService.put(`/api/blogs/${blogId}/comments/${commentId}`, commentData);
  },

  // Delete comment
  deleteComment: async (blogId, commentId) => {
    return httpService.delete(`/api/blogs/${blogId}/comments/${commentId}`);
  },
};

export default blogsApi;
