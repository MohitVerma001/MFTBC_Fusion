/**
 * HTTP Service - Centralized HTTP wrapper with interceptors and error handling
 * FUSO Brand Theme: Never use Supabase - Pure PostgreSQL + Express backend
 */

class HttpService {
  constructor() {
    this.baseURL = window.__ENV?.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (like file downloads)
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorData = contentType?.includes('application/json')
          ? await response.json()
          : { message: response.statusText };
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      // Return response directly for non-JSON content
      if (!contentType?.includes('application/json')) {
        return response;
      }

      return await response.json();
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  async uploadFile(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Upload Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }
}

export default new HttpService();
