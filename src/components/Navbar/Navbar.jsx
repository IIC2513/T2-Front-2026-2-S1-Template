import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <span>DCCapital</span>
        </Link>

        <ul className="navbar-nav">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/market" className={({ isActive }) => (isActive ? 'active' : '')}>
              Mercado
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Mi Portfolio
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Perfil
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="navbar-balance">
                {user?.balance ?? 0} DCCoins
              </Link>
              <button onClick={handleLogout} className="btn btn-danger navbar-logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
