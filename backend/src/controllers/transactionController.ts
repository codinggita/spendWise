import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  listTransactions, createTransaction, getTransactionById,
  updateTransaction, deleteTransaction,
} from '../services/transactionService';
import { AppError } from '../utils/AppError';

const TRANSACTION_SOURCES = ['UPI', 'NEFT', 'IMPS', 'RTGS', 'CARD', 'WALLET', 'NETBANKING', 'CASH', 'OTHER'] as const;
const TRANSACTION_TYPES = ['debit', 'credit'] as const;
const TRANSACTION_CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Utilities & Bills', 'Entertainment',
  'Healthcare', 'Travel', 'Education', 'Groceries', 'Fuel', 'EMI & Loans',
  'Insurance', 'Investment', 'Transfer', 'Income', 'Recharge & Subscriptions', 'Other',
] as const;

const createTransactionSchema = z.object({
  amount: z.number(),
  type: z.enum(TRANSACTION_TYPES),
  rawDescription: z.string().min(1).max(500),
  source: z.enum(TRANSACTION_SOURCES),
  sourceName: z.string().min(1).max(100),
  date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  merchantName: z.string().max(100).optional(),
  upiId: z.string().max(100).optional(),
  bankReference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isRecurring: z.boolean().optional(),
  currency: z.string().length(3).default('INR'),
});

const updateTransactionSchema = z.object({
  category: z.enum(TRANSACTION_CATEGORIES).optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isRecurring: z.boolean().optional(),
  merchantName: z.string().max(100).optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.enum(TRANSACTION_CATEGORIES).optional(),
  source: z.enum(TRANSACTION_SOURCES).optional(),
  type: z.enum(TRANSACTION_TYPES).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().max(100).optional(),
  isRecurring: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const { page, limit, sortBy, sortOrder, ...filters } = parsed.data;
    const result = await listTransactions(
      { userId, ...filters },
      { page, limit, sortBy, sortOrder }
    );

    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const createTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const transaction = await createTransaction(userId, parsed.data);
    res.status(201).json({ success: true, data: { transaction } });
  } catch (err) { next(err); }
};

export const getTransactionByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const transaction = await getTransactionById(req.params.id as string, userId);
    res.status(200).json({ success: true, data: { transaction } });
  } catch (err) { next(err); }
};

export const updateTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = updateTransactionSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const transaction = await updateTransaction(req.params.id as string, userId, parsed.data);
    res.status(200).json({ success: true, data: { transaction } });
  } catch (err) { next(err); }
};

export const deleteTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    await deleteTransaction(req.params.id as string, userId);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) { next(err); }
};
