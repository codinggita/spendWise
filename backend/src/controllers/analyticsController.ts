import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  getSpendingByCategory, getMonthlyTrend, getDashboardSummary,
  getSourceBreakdown, getTopMerchants,
} from '../services/analyticsService';
import { getUserById } from '../services/authService';
import { AppError } from '../utils/AppError';

const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  months: z.coerce.number().min(1).max(24).default(6),
  limit: z.coerce.number().min(1).max(50).default(10),
});

const getDateRange = (startDate?: string, endDate?: string) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(end.getFullYear(), end.getMonth(), 1);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const user = await getUserById(userId);
    const monthlyBudget = user?.monthlyBudget || 0;
    const summary = await getDashboardSummary(userId, monthlyBudget);

    res.status(200).json({ success: true, data: summary });
  } catch (err) { next(err); }
};

export const getCategoryBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = dateRangeSchema.safeParse(req.query);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const { startDate, endDate } = parsed.data;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await getSpendingByCategory(userId, start, end);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

export const getMonthlyTrendHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = dateRangeSchema.safeParse(req.query);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const data = await getMonthlyTrend(userId, parsed.data.months);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

export const getSourceBreakdownHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = dateRangeSchema.safeParse(req.query);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const { startDate, endDate } = parsed.data;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await getSourceBreakdown(userId, start, end);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

export const getTopMerchantsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));

    const parsed = dateRangeSchema.safeParse(req.query);
    if (!parsed.success) return next(new AppError(parsed.error.issues[0].message, 400));

    const { startDate, endDate, limit } = parsed.data;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await getTopMerchants(userId, start, end, limit);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};
