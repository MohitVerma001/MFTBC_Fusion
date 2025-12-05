/**
 * Upload API - File upload-related API calls
 * FUSO Brand Theme: PostgreSQL backend only
 */
import httpService from './http.service.js';

export const uploadApi = {
  // Upload single file
  uploadFile: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return httpService.uploadFile('/api/upload', formData);
  },

  // Upload multiple files
  uploadFiles: async (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    return httpService.uploadFile('/api/upload/multiple', formData);
  },

  // Upload image with specific handling
  uploadImage: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('image', file);

    if (options.resize) {
      formData.append('resize', JSON.stringify(options.resize));
    }
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    return httpService.uploadFile('/api/upload/image', formData);
  },

  // Delete file
  deleteFile: async (fileUrl) => {
    return httpService.delete('/api/upload', {
      body: JSON.stringify({ fileUrl }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default uploadApi;
