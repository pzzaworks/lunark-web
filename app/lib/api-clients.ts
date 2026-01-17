import { createAxiosInstance } from './axios';

const api = createAxiosInstance();

// Task API
export const taskAPI = {
  create: (data: {
    title: string;
    description?: string;
    priority?: string;
    deadline?: string;
    metadata?: Record<string, unknown>;
    chatId: string;
  }) => api.post('/task', data),

  list: (status?: string) => api.get('/task', { params: { status } }),

  get: (taskId: string) => api.get(`/task/${taskId}`),

  updateStatus: (taskId: string, status: string) =>
    api.patch(`/task/${taskId}/status`, { status }),

  updateProgress: (taskId: string, progress: number) =>
    api.patch(`/task/${taskId}/progress`, { progress }),

  getProgress: (taskId: string) => api.get(`/task/${taskId}/progress`),

  addNote: (taskId: string, note: string) => api.post(`/task/${taskId}/notes`, { note }),

  cancel: (taskId: string) => api.post(`/task/${taskId}/cancel`),

  retry: (taskId: string) => api.post(`/task/${taskId}/retry`),

  delete: (taskId: string) => api.delete(`/task/${taskId}`),
};

// Document/RAG API
export const documentAPI = {
  add: (data: { chatId: string; content: string; metadata?: Record<string, unknown> }) =>
    api.post('/document', data),

  search: (data: { chatId: string; query: string; limit?: number }) =>
    api.post('/document/search', data),

  update: (documentId: string, content: string) =>
    api.patch(`/document/${documentId}`, { content }),

  delete: (documentId: string) => api.delete(`/document/${documentId}`),
};

// Graph API
export const graphAPI = {
  create: (data: { name: string; description?: string }) => api.post('/graph', data),

  linkToTask: (graphId: string, taskId: string) =>
    api.post(`/graph/${graphId}/link`, { taskId }),

  addNode: (
    graphId: string,
    data: {
      type: string;
      name: string;
      description?: string;
      config?: Record<string, unknown>;
      timeout?: number;
    }
  ) => api.post(`/graph/${graphId}/nodes`, data),

  addEdge: (graphId: string, data: { fromNodeId: string; toNodeId: string }) =>
    api.post(`/graph/${graphId}/edges`, data),

  execute: (graphId: string) => api.post(`/graph/${graphId}/execute`),

  getStatus: (graphId: string) => api.get(`/graph/${graphId}/status`),
};

// Usage API
export const usageAPI = {
  getChatUsage: (chatId: string) => api.get(`/usage/chat/${chatId}`),

  getUserUsage: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/usage/user', { params }),

  getBalance: () => api.get('/usage/balance'),

  estimateCost: (data: { model: string; promptText: string; expectedResponseLength?: number }) =>
    api.post('/usage/estimate', data),
};

// Payment API
export const paymentAPI = {
  create: (data: {
    amount: number;
    currency?: string;
    method: string;
    metadata?: Record<string, unknown>;
  }) => api.post('/payment', data),

  verify: (paymentId: string, data: { transactionHash?: string; externalId?: string }) =>
    api.post(`/payment/${paymentId}/verify`, data),

  get: (paymentId: string) => api.get(`/payment/${paymentId}`),

  list: (status?: string) => api.get('/payment', { params: { status } }),

  refund: (paymentId: string, reason?: string) =>
    api.post(`/payment/${paymentId}/refund`, { reason }),

  getUserStats: () => api.get('/payment/user/stats'),

  generateIntent: (data: { amount: number; currency?: string }) =>
    api.post('/payment/intent', data),
};

export default {
  task: taskAPI,
  document: documentAPI,
  graph: graphAPI,
  usage: usageAPI,
  payment: paymentAPI,
};
