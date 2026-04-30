import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { store, AppDispatch, RootState } from '@/store';
import { checkAuth } from '@/store/slices/authSlice';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';

// Lazy load components for performance
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionFeedPage = lazy(() => import('@/pages/TransactionFeedPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#131313]">
    <div className="text-[#ddb7ff] font-['Lexend'] text-xl animate-pulse">
      Loading SpendWise...
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);

  if (!initialized) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/analytics" element={<DashboardPage />} />
          <Route path="/feed" element={<TransactionFeedPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Redirect from root-like protected access */}
          <Route path="/app" element={<Navigate to="/analytics" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
