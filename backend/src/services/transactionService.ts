import { Transaction, ITransaction, TransactionCategory, TransactionSource, TransactionType } from '../models/Transaction';
import { AppError } from '../utils/AppError';
import { translateAndCategorize } from './openaiService';
import logger from '../utils/logger';
import mongoose from 'mongoose';

export interface TransactionFilters {
  userId: string;
  startDate?: string;
  endDate?: string;
  category?: TransactionCategory;
  source?: TransactionSource;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  tags?: string[];
  isRecurring?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const buildQuery = (filters: TransactionFilters) => {
  const query: any = { userId: new mongoose.Types.ObjectId(filters.userId) };

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }
  if (filters.category) query.category = filters.category;
  if (filters.source) query.source = filters.source;
  if (filters.type) query.type = filters.type;
  if (filters.isRecurring !== undefined) query.isRecurring = filters.isRecurring;
  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    query.amount = {};
    if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
    if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
  }
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags.map((t) => t.toLowerCase()) };
  }
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  return query;
};

export const listTransactions = async (
  filters: TransactionFilters,
  pagination: PaginationOptions = {}
): Promise<PaginatedResult<ITransaction>> => {
  const page = Math.max(1, pagination.page || 1);
  const limit = Math.min(100, Math.max(1, pagination.limit || 20));
  const skip = (page - 1) * limit;

  const sortField = pagination.sortBy || 'date';
  const sortDirection = pagination.sortOrder === 'asc' ? 1 : -1;

  const query = buildQuery(filters);
  const [data, total] = await Promise.all([
    Transaction.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    data: data as ITransaction[],
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const createTransaction = async (
  userId: string,
  data: {
    amount: number;
    type: TransactionType;
    rawDescription: string;
    source: TransactionSource;
    sourceName: string;
    date: string;
    merchantName?: string;
    upiId?: string;
    bankReference?: string;
    notes?: string;
    tags?: string[];
    isRecurring?: boolean;
    currency?: string;
  }
): Promise<ITransaction> => {
  const { plainLanguage, category } = await translateAndCategorize(data.rawDescription);

  const transaction = await Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    ...data,
    plainLanguage,
    category,
    date: new Date(data.date),
    currency: data.currency || 'INR',
  });

  logger.info(`Transaction created for user ${userId}: ₹${data.amount} - ${plainLanguage}`);
  return transaction;
};

export const getTransactionById = async (
  transactionId: string,
  userId: string
): Promise<ITransaction> => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();
  if (!transaction) throw new AppError('Transaction not found', 404);
  return transaction as ITransaction;
};

export const updateTransaction = async (
  transactionId: string,
  userId: string,
  data: Partial<Pick<ITransaction, 'category' | 'notes' | 'tags' | 'isRecurring' | 'merchantName'>>
): Promise<ITransaction> => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, userId: new mongoose.Types.ObjectId(userId) },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!transaction) throw new AppError('Transaction not found', 404);
  return transaction;
};

export const deleteTransaction = async (transactionId: string, userId: string): Promise<void> => {
  const result = await Transaction.deleteOne({
    _id: transactionId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (result.deletedCount === 0) throw new AppError('Transaction not found', 404);
};

export const bulkCreateTransactions = async (
  userId: string,
  transactions: Array<{
    amount: number;
    type: TransactionType;
    rawDescription: string;
    source: TransactionSource;
    sourceName: string;
    date: string;
    merchantName?: string;
    upiId?: string;
    bankReference?: string;
    currency?: string;
  }>
): Promise<{ created: number; failed: number }> => {
  let created = 0;
  let failed = 0;

  const processed = await Promise.allSettled(
    transactions.map(async (t) => {
      const { plainLanguage, category } = await translateAndCategorize(t.rawDescription);
      return {
        userId: new mongoose.Types.ObjectId(userId),
        ...t,
        plainLanguage,
        category,
        date: new Date(t.date),
        currency: t.currency || 'INR',
      };
    })
  );

  const docs = processed
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value);

  failed = transactions.length - docs.length;

  if (docs.length > 0) {
    const result = await Transaction.insertMany(docs, { ordered: false });
    created = result.length;
  }

  logger.info(`Bulk import for user ${userId}: ${created} created, ${failed} failed`);
  return { created, failed };
};
