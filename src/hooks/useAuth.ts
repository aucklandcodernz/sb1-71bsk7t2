import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout
  };
};