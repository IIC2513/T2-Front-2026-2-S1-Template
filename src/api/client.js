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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.endsWith('/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('dccapital_token');
      localStorage.removeItem('dccapital_user');
      window.dispatchEvent(new Event('dccapital:session-expired'));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
