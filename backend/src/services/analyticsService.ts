import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction';

export interface SpendingByCategoryResult {
  category: string;
  total: number;
  count: number;
  percentage: number;
  avgAmount: number;
}

export interface MonthlyTrendResult {
  year: number;
  month: number;
  monthLabel: string;
  totalDebit: number;
  totalCredit: number;
  netFlow: number;
  transactionCount: number;
}

export interface DashboardSummaryResult {
  currentMonthSpend: number;
  currentMonthIncome: number;
  lastMonthSpend: number;
  totalTransactions: number;
  avgDailySpend: number;
  topCategory: string;
  budgetUtilization: number;
  savingsRate: number;
}

export interface SourceBreakdownResult {
  source: string;
  total: number;
  count: number;
  percentage: number;
}

const MONTHS_IN_HINDI: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
};

export const getSpendingByCategory = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<SpendingByCategoryResult[]> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const results = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: 'debit',
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = results.reduce((sum, r) => sum + r.total, 0);

  return results.map((r) => ({
    category: r._id,
    total: Math.round(r.total * 100) / 100,
    count: r.count,
    percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 10000) / 100 : 0,
    avgAmount: Math.round(r.avgAmount * 100) / 100,
  }));
};

export const getMonthlyTrend = async (
  userId: string,
  months: number = 6
): Promise<MonthlyTrendResult[]> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const results = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { year: '$_id.year', month: '$_id.month' },
        entries: {
          $push: { type: '$_id.type', total: '$total', count: '$count' },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return results.map((r) => {
    const debit = r.entries.find((e: any) => e.type === 'debit');
    const credit = r.entries.find((e: any) => e.type === 'credit');
    const totalDebit = debit?.total || 0;
    const totalCredit = credit?.total || 0;
    const totalCount = r.entries.reduce((s: number, e: any) => s + e.count, 0);

    return {
      year: r._id.year,
      month: r._id.month,
      monthLabel: `${MONTHS_IN_HINDI[r._id.month]} ${r._id.year}`,
      totalDebit: Math.round(totalDebit * 100) / 100,
      totalCredit: Math.round(totalCredit * 100) / 100,
      netFlow: Math.round((totalCredit - totalDebit) * 100) / 100,
      transactionCount: totalCount,
    };
  });
};

export const getDashboardSummary = async (
  userId: string,
  monthlyBudget: number = 0
): Promise<DashboardSummaryResult> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [currentMonth, lastMonth, topCategoryResult] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: userObjectId, date: { $gte: currentMonthStart } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      { $match: { userId: userObjectId, date: { $gte: lastMonthStart, $lte: lastMonthEnd }, type: 'debit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { userId: userObjectId, date: { $gte: currentMonthStart }, type: 'debit' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]),
  ]);

  const debitEntry = currentMonth.find((e) => e._id === 'debit');
  const creditEntry = currentMonth.find((e) => e._id === 'credit');
  const currentMonthSpend = debitEntry?.total || 0;
  const currentMonthIncome = creditEntry?.total || 0;
  const totalTransactions = currentMonth.reduce((s, e) => s + e.count, 0);
  const lastMonthSpend = lastMonth[0]?.total || 0;

  const daysIntoMonth = now.getDate();
  const avgDailySpend = daysIntoMonth > 0 ? currentMonthSpend / daysIntoMonth : 0;
  const topCategory = topCategoryResult[0]?._id || 'N/A';

  const budgetUtilization = monthlyBudget > 0
    ? Math.round((currentMonthSpend / monthlyBudget) * 10000) / 100
    : 0;

  const savingsRate = currentMonthIncome > 0
    ? Math.round(((currentMonthIncome - currentMonthSpend) / currentMonthIncome) * 10000) / 100
    : 0;

  return {
    currentMonthSpend: Math.round(currentMonthSpend * 100) / 100,
    currentMonthIncome: Math.round(currentMonthIncome * 100) / 100,
    lastMonthSpend: Math.round(lastMonthSpend * 100) / 100,
    totalTransactions,
    avgDailySpend: Math.round(avgDailySpend * 100) / 100,
    topCategory,
    budgetUtilization,
    savingsRate,
  };
};

export const getSourceBreakdown = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<SourceBreakdownResult[]> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const results = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: 'debit',
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$source',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = results.reduce((sum, r) => sum + r.total, 0);

  return results.map((r) => ({
    source: r._id,
    total: Math.round(r.total * 100) / 100,
    count: r.count,
    percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 10000) / 100 : 0,
  }));
};

export const getTopMerchants = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<Array<{ merchant: string; total: number; count: number }>> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const results = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: 'debit',
        date: { $gte: startDate, $lte: endDate },
        merchantName: { $exists: true, $ne: '' },
      },
    },
    {
      $group: {
        _id: '$merchantName',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $limit: limit },
  ]);

  return results.map((r) => ({
    merchant: r._id,
    total: Math.round(r.total * 100) / 100,
    count: r.count,
  }));
};
