import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [error, setError] = useState(() => (
    location.state?.sessionExpired
      ? 'Tu sesión expiró. Inicia sesión nuevamente.'
      : ''
  ));
  const errorRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData.username.trim(), formData.password);
      navigate('/portfolio');
    } catch (err) {
      setError(getErrorMessage(err, 'Error al iniciar sesión. Intenta nuevamente.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Mueve el foco al mensaje de error para que lectores de pantalla lo
  // anuncien y usuarios de teclado no tengan que buscarlo visualmente.
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  return (
    <div className="login">
      <div className="login-container card">
        <div className="login-header">
          <h1 className="login-title">Iniciar sesión</h1>
          <p className="login-subtitle">Si no tienes cuenta se creará con el primer registro</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ingresa tu nombre de usuario"
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ingresa tu contraseña"
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && (
            <div className="alert alert-error" role="alert" tabIndex={-1} ref={errorRef}>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>


        <Link to="/" className="login-back">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Login;
