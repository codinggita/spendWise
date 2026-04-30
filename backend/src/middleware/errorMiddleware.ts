import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import AppError from '../utils/AppError';

const errorMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Normalize error
  const error = err instanceof Error ? err : new Error('An unexpected error occurred');
  const statusCode = (error as any).statusCode || 500;
  const status = (error as any).status || (statusCode >= 400 && statusCode < 500 ? 'fail' : 'error');
  
  // H5 Fix: Treat all 400-level errors as operational if they aren't explicitly marked
  const isOperational = (error instanceof AppError && error.isOperational) || (statusCode >= 400 && statusCode < 500);
  const message = error.message || 'Internal Server Error';

  // Log error details (log stack trace for unexpected errors)
  if (isOperational) {
    logger.warn(`${status}: ${message} | ${req.method} ${req.originalUrl} | ${statusCode}`);
  } else {
    logger.error(`Unexpected error: ${message} | ${req.method} ${req.originalUrl} | ${statusCode}`, {
      stack: error.stack,
    });
  }

  // In production: show message for operational errors, hide for unexpected ones
  const clientMessage = process.env.NODE_ENV === 'production' && !isOperational
    ? 'An internal error occurred'
    : message;

  res.status(statusCode).json({
    success: false,
    status,
    message: clientMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export default errorMiddleware;
