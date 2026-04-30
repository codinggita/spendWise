import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { login, register, logoutUser, googleAuth } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (email: string, password: string) => {
    return dispatch(login({ email, password }));
  };

  const handleRegister = async (email: string, password: string, name: string, username?: string) => {
    return dispatch(register({ email, password, name, username }));
  };

  const handleGoogleAuth = async (googleId: string, email: string, name: string) => {
    return dispatch(googleAuth({ googleId, email, name }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    googleAuth: handleGoogleAuth,
    logout: handleLogout,
  };
};
