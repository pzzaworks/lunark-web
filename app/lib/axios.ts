import axios from "axios";

let logoutCallback: (() => Promise<void>) | null = null;
let currentUser: any | null = null;

export const setLogoutCallback = (callback: (() => Promise<void>) | null) => {
  logoutCallback = callback;
};

export const setCurrentUser = (user: any | null) => {
  currentUser = user;
};

export const createAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    // API Key
    config.headers['X-API-Key'] = process.env.NEXT_PUBLIC_API_KEY;

    // Session Token
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }

    // User ID
    if (currentUser?.id) {
      config.headers['x-user-id'] = currentUser.id;
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      const newToken = response.headers['x-new-token'];
      if (newToken) {
        localStorage.setItem('sessionToken', newToken);
      }
      return response;
    },
    async (error) => {
      if (error.response?.status === 401 && logoutCallback) {
        await logoutCallback();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const api = createAxiosInstance();