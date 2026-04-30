import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { register, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric')
    .toLowerCase(),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(4, 'Password must be at least 4 characters').max(72),
});

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});

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

    const validation = registerSchema.safeParse({ name, username, email, password });
    if (!validation.success) {
      const formattedErrors: any = {};
      validation.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setLocalErrors(formattedErrors);
      return;
    }

    const result = await dispatch(register({ name, username, email, password }));
    if (register.fulfilled.match(result)) {
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
              Create Account
            </h1>
            <p className="text-sm mt-2 text-[#888] font-['Public_Sans']">
              Free forever. Start tracking in seconds.
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
                htmlFor="name"
                className="block text-sm font-['Public_Sans'] font-semibold text-[#4cd7f6] uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={`neo-input w-full bg-[#131313] text-white px-4 py-3 font-['Public_Sans'] ${
                  localErrors.name ? 'border-[#ff3333]' : ''
                }`}
              />
              {localErrors.name && (
                <p className="text-xs text-[#ff3333] font-['Public_Sans'] mt-1">
                  {localErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-['Public_Sans'] font-semibold text-[#4cd7f6] uppercase tracking-wider"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="priya_s"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={`neo-input w-full bg-[#131313] text-white px-4 py-3 font-['Public_Sans'] ${
                  localErrors.username ? 'border-[#ff3333]' : ''
                }`}
              />
              {localErrors.username && (
                <p className="text-xs text-[#ff3333] font-['Public_Sans'] mt-1">
                  {localErrors.username}
                </p>
              )}
            </div>

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
                placeholder="priya@example.com"
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
                placeholder="Min. 4 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#888] font-['Public_Sans']">
              Already have an account?{' '}
              <Link to="/login" className="text-[#e2c62d] hover:underline font-bold">
                Sign in
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

export default RegisterPage;