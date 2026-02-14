import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.180:3001/api';
console.log('🔗 API URL:', API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Posts API
export const postsApi = {
  // Get all posts with filters and pagination
  getAll: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get single post by ID
  getById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  create: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // Update post
  update: async (id, data) => {
    const response = await api.patch(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Preview post
  preview: async (id) => {
    const response = await api.get(`/posts/${id}/preview`);
    return response.data;
  },

  // Get SEO score
  getSeoScore: async (id) => {
    const response = await api.get(`/posts/${id}/seo-score`);
    return response.data;
  },

  // Toggle publish status
  togglePublish: async (id) => {
    const response = await api.patch(`/posts/${id}/toggle-publish`);
    return response.data;
  },

  // View post by slug (increments views)
  viewBySlug: async (slug) => {
    const response = await api.get(`/posts/view/${slug}`);
    return response.data;
  },
};

export default api;