import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  registerUser, loginUser, getUserById, updateUserProfile,
  findOrCreateGoogleUser, generateToken, setTokenCookie, clearTokenCookie,
  deleteUser,
} from '../services/authService';
import { AppError } from '../utils/AppError';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20).regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric').toLowerCase(),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(72),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  monthlyBudget: z.number().min(0).optional(),
  preferredLanguage: z.enum(['en', 'hi']).optional(),
  avatar: z.string().url().optional(),
});

const sanitizeUser = (user: any) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));
    const { name, email, password, username } = parsed.data;
    const user = await registerUser(name, email, password, username);
    const token = generateToken((user._id as any).toString());
    setTokenCookie(res, token);
    res.status(201).json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) { next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));
    const { email, password } = parsed.data;
    const user = await loginUser(email, password);
    const token = generateToken((user._id as any).toString());
    setTokenCookie(res, token);
    res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) { next(err); }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));
    const user = await getUserById(userId);
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, data: { user } });
  } catch (err) { next(err); }
};

export const deleteAccountHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    await deleteUser(userId);
    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Account and all associated data have been deleted successfully.',
    });
  } catch (err) { next(err); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));
    const user = await updateUserProfile(userId, parsed.data);
    res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) { next(err); }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));
    const { googleId, email, name, avatar } = parsed.data;
    const user = await findOrCreateGoogleUser(googleId, email, name, avatar);
    const token = generateToken((user._id as any).toString());
    setTokenCookie(res, token);
    res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) { next(err); }
};
