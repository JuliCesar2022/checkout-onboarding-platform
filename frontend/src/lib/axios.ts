import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: unwrap NestJS ResponseInterceptor envelope { data: T, timestamp: string } → T
client.interceptors.response.use(
  (response) => {
    if (response.data !== null && typeof response.data === 'object' && 'data' in response.data && 'timestamp' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  },
);

export default client;
