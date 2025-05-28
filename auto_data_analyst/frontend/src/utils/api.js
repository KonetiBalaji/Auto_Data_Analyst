import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dataset endpoints
export const datasetApi = {
  upload: (file, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return api.post('/api/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  list: () => api.get('/api/datasets'),
  get: (id) => api.get(`/api/datasets/${id}`),
  delete: (id) => api.delete(`/api/datasets/${id}`),
};

// Analysis endpoints
export const analysisApi = {
  run: (datasetId, analysisType) =>
    api.post('/api/analysis/run', { datasetId, analysisType }),
  getResults: (analysisId) => api.get(`/api/analysis/${analysisId}`),
  list: () => api.get('/api/analysis'),
};

// Model endpoints
export const modelApi = {
  train: (config) => api.post('/api/models/train', config),
  list: () => api.get('/api/models'),
  get: (id) => api.get(`/api/models/${id}`),
  evaluate: (id) => api.post(`/api/models/${id}/evaluate`),
  delete: (id) => api.delete(`/api/models/${id}`),
};

// Report endpoints
export const reportApi = {
  generate: (config) => api.post('/api/reports/generate', config),
  list: () => api.get('/api/reports'),
  get: (id) => api.get(`/api/reports/${id}`),
  download: (id) => api.get(`/api/reports/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/api/reports/${id}`),
};

// User endpoints
export const userApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  changePassword: (data) => api.post('/api/users/change-password', data),
};

// Settings endpoints
export const settingsApi = {
  get: () => api.get('/api/settings'),
  update: (settings) => api.put('/api/settings', settings),
  createApiKey: (name) => api.post('/api/settings/api-keys', { name }),
  deleteApiKey: (id) => api.delete(`/api/settings/api-keys/${id}`),
};

// Deep Learning endpoints
export const deepLearningApi = {
  // CNN
  trainCnn: (file, epochs = 5, numClasses = 10) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('epochs', epochs);
    formData.append('num_classes', numClasses);
    return api.post('/api/v1/deep-learning/cnn/train', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  predictCnn: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/v1/deep-learning/cnn/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Transformer
  trainTransformer: (file, epochs = 3, numLabels = 2) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('epochs', epochs);
    formData.append('num_labels', numLabels);
    return api.post('/api/v1/deep-learning/transformer/train', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  predictTransformer: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/v1/deep-learning/transformer/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // RNN/LSTM
  trainRnn: (file, epochs = 10) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('epochs', epochs);
    return api.post('/api/v1/deep-learning/rnn/train', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  predictRnn: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/v1/deep-learning/rnn/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api; 