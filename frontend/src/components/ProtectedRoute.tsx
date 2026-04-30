import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useEffect } from 'react';
import { checkAuth } from '@/store/slices/authSlice';

export const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, initialized } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      dispatch(checkAuth());
    }
  }, [dispatch, initialized]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
