import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comprueba si existe una sesión válida en el backend
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/me');
      setUser(data);
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        return null;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Al cargar la aplicación, preguntamos al backend
  // si ya existe una sesión válida.
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (username, password) => {
    const { data } = await apiClient.post('/login', {
      username,
      password,
    });

    setUser(data.user);

    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout');
    } finally {
      setUser(null);
    }
  }, []);

  // Permite actualizar datos del usuario, por ejemplo el balance.
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...patch,
      };
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }

  return ctx;
}