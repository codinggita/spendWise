import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import env from '../config/env';
import logger from '../utils/logger';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET as string, { expiresIn: '7d' });
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  username?: string
): Promise<IUser> => {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    if (existing.email === email) throw new AppError('Email is already registered', 409);
    throw new AppError('Username is already taken', 409);
  }
  const user = await User.create({ name, email, password, username });
  logger.info(`New user registered: ${email} (${username || 'no-username'})`);
  return user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  // Delete all user's transactions
  const { Transaction } = await import('../models/Transaction');
  await Transaction.deleteMany({ userId });

  // Delete the user
  await User.findByIdAndDelete(userId);
  logger.info(`User and their data deleted: ${user.email}`);
};

export const loginUser = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);
  user.lastLogin = new Date();
  await user.save();
  logger.info(`User logged in: ${email}`);
  return user;
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).lean() as Promise<IUser | null>;
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<Pick<IUser, 'name' | 'monthlyBudget' | 'preferredLanguage' | 'avatar'>>
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const findOrCreateGoogleUser = async (
  googleId: string,
  email: string,
  name: string,
  avatar?: string
): Promise<IUser> => {
  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  if (user) {
    if (!user.googleId) user.googleId = googleId;
    if (avatar && !user.avatar) user.avatar = avatar;
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = await User.create({ googleId, email, name, avatar, isVerified: true });
    logger.info(`New Google OAuth user: ${email}`);
  }
  return user;
};
