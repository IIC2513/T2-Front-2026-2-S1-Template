import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('dccapital_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export function getErrorMessage(error, fallback = 'Ocurrió un error inesperado.') {
  return error?.response?.data?.error || fallback;
}

export default apiClient;
