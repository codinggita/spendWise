import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { login, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{ email?: string; password?: string }>({});
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error: apiError } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/feed', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setLocalErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const formattedErrors: any = {};
      validation.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setLocalErrors(formattedErrors);
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="neo-card bg-[#0e0e0e] p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1
              className="text-3xl sm:text-4xl font-['Lexend'] font-bold text-[#ddb7ff] uppercase tracking-wider"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              Welcome Back
            </h1>
            <p className="text-sm mt-2 text-[#888] font-['Public_Sans']">
              Sign in to your SpendWise account
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-[#ff3333]/10 border-2 border-[#ff3333] text-[#ff3333] font-['Public_Sans'] font-medium">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-['Public_Sans'] font-semibold text-[#4cd7f6] uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`neo-input w-full bg-[#131313] text-white px-4 py-3 font-['Public_Sans'] ${
                  localErrors.email ? 'border-[#ff3333]' : ''
                }`}
              />
              {localErrors.email && (
                <p className="text-xs text-[#ff3333] font-['Public_Sans'] mt-1">
                  {localErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-['Public_Sans'] font-semibold text-[#4cd7f6] uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`neo-input w-full bg-[#131313] text-white px-4 py-3 font-['Public_Sans'] ${
                  localErrors.password ? 'border-[#ff3333]' : ''
                }`}
              />
              {localErrors.password && (
                <p className="text-xs text-[#ff3333] font-['Public_Sans'] mt-1">
                  {localErrors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="neo-btn w-full bg-[#ddb7ff] text-black font-['Lexend'] font-bold uppercase tracking-wider py-4 text-base sm:text-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-[#333]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0e0e0e] px-4 text-[#888] font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-white text-black font-['Lexend'] font-bold uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-3 hover:bg-[#eee] transition-all border-2 border-black"
            onClick={() => {
              // Placeholder for Google OAuth
              alert('Google Login configuration required. See backend .env for GOOGLE_CLIENT_ID');
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#888] font-['Public_Sans']">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#e2c62d] hover:underline font-bold">
                Create one free
              </Link>
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link to="/" className="text-xs text-[#666] hover:text-white font-['Public_Sans']">
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;