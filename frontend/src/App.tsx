import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { store, AppDispatch, RootState } from '@/store';
import { checkAuth } from '@/store/slices/authSlice';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import { ThemeProvider } from '@/context/ThemeContext';

// Lazy load components for performance
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionFeedPage = lazy(() => import('@/pages/TransactionFeedPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-primary font-['Lexend'] text-xl font-black uppercase tracking-widest animate-pulse">
      Loading SpendWise...
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);

  if (!initialized) {
    return <LoadingSpinner />;
  }

  // Redirect to landing page if not authenticated instead of /login
  // This ensures the landing page is the default view for all unauthenticated access
  if (!isAuthenticated) return <Navigate to="/" replace />;
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
        {/* Landing page is the default view at the root URL */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Auth Routes */}
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
          
          {/* Internal app redirect */}
          <Route path="/app" element={<Navigate to="/analytics" replace />} />
        </Route>

        {/* Fallback: Any undefined route redirects to the landing page (root) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
