import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL ||
  'https://t2-back-2026-2-production.up.railway.app/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export function getErrorMessage(
  error,
  fallback = 'Ocurrió un error inesperado.'
) {
  return error?.response?.data?.error || fallback;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.endsWith('/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      window.dispatchEvent(new Event('dccapital:session-expired'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;