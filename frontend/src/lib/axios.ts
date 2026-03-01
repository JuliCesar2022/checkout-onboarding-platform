import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: normalize error shape
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  },
);

export default client;
