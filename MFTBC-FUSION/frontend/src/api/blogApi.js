const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const blogApi = {
  async createBlog(formData) {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  },

  async getBlogs(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/blogs?${params}`);
    return await response.json();
  },

  async getBlogById(id) {
    const response = await fetch(`${API_URL}/blogs/${id}`);
    return await response.json();
  },

  async updateBlog(id, data) {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  async deleteBlog(id) {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  async getCategories(parentCategory) {
    const params = parentCategory ? `?parentCategory=${parentCategory}` : '';
    const response = await fetch(`${API_URL}/categories${params}`);
    return await response.json();
  },

  async getTags(search = '') {
    const params = search ? `?search=${search}` : '';
    const response = await fetch(`${API_URL}/tags${params}`);
    return await response.json();
  },

  async createTag(name) {
    const response = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return await response.json();
  },

  async getPlaces() {
    const response = await fetch(`${API_URL}/places`);
    return await response.json();
  },
};

export default blogApi;
