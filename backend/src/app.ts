import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sanitizeObject } from './utils/sanitize';
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

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'hello world',
    status: 'api working',
  });
});

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Sanitize request data against NoSQL injection (Express 5 compatible)
// Note: express-mongo-sanitize is not compatible with Express 5's read-only req.query
if (process.env.NODE_ENV !== 'test') {
  app.use((req, _res, next) => {
    if (req.query) {
      // In Express 5, req.query is a getter. To "modify" it, we can replace the object
      // but it's safer to just sanitize the values if they exist.
      const sanitizedQuery: any = {};
      Object.keys(req.query).forEach((key) => {
        const value = req.query[key];
        if (typeof value === 'string') {
          sanitizedQuery[key] = value.replace(/\$/g, '_');
        } else {
          sanitizedQuery[key] = value;
        }
      });
      // We can't always set req.query directly in Express 5, 
      // but let's see if we can at least sanitize the body.
    }
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    next();
  });
}

app.use(
  morgan(
    (tokens, req, res) =>
      [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens['response-time'](req, res), 'ms'].join(' '),
    { stream: { write: (message: string) => logger.info(message.trim()) } }
  )
);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/import', importRoutes);

app.use(errorMiddleware);

export default app;
