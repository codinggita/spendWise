import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import env from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email?: string };
    }
  }
}

interface JwtPayload {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return next(new AppError('Invalid authentication token.', 401));
    }
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid authentication token.', 401));
    }
    next(new AppError('Authentication failed.', 401));
  }
};

export default protect;
