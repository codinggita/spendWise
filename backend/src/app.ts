import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import env from './config/env';
import logger from './utils/logger';
import errorMiddleware from './middleware/errorMiddleware';

import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import importRoutes from './routes/importRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Sanitize request data against NoSQL injection
if (process.env.NODE_ENV !== 'test') {
  app.use(mongoSanitize({
    replaceWith: '_',
  }));
}

app.use(
  morgan(
    (tokens, req, res) =>
      [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens['response-time'](req, res), 'ms'].join(' '),
    { stream: { write: (message: string) => logger.info(message.trim()) } }
  )
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 minutes for auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use(globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/import', importRoutes);

app.use(errorMiddleware);

export default app;
