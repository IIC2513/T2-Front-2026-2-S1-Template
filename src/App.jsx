import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import MarketPage from './pages/Market/MarketPage';
import PortfolioPage from './pages/Portfolio/PortfolioPage';
import ProfilePage from './pages/Profile/ProfilePage';
import './App.css';

function SessionExpiredHandler() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
      navigate('/login', { replace: true, state: { sessionExpired: true } });
    };

    window.addEventListener('dccapital:session-expired', handleSessionExpired);
    return () => window.removeEventListener('dccapital:session-expired', handleSessionExpired);
  }, [logout, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SessionExpiredHandler />
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/market" element={<MarketPage />} />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <PortfolioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
