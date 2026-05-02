import mongoose, { Document, Schema } from 'mongoose';

export type TransactionSource = 'UPI' | 'NEFT' | 'IMPS' | 'RTGS' | 'CARD' | 'WALLET' | 'NETBANKING' | 'CASH' | 'OTHER';
export type TransactionType = 'debit' | 'credit';
export type TransactionCategory =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Utilities & Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Travel'
  | 'Education'
  | 'Groceries'
  | 'Fuel'
  | 'EMI & Loans'
  | 'Insurance'
  | 'Investment'
  | 'Transfer'
  | 'Income'
  | 'Recharge & Subscriptions'
  | 'Other';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  type: TransactionType;
  category: TransactionCategory;
  plainLanguage: string;
  rawDescription: string;
  source: TransactionSource;
  sourceName: string;
  merchantName?: string;
  upiId?: string;
  bankReference?: string;
  date: Date;
  isRecurring: boolean;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    type: { type: String, enum: ['debit', 'credit'], required: true },
    category: {
      type: String,
      enum: [
        'Food & Dining', 'Transport', 'Shopping', 'Utilities & Bills',
        'Entertainment', 'Healthcare', 'Travel', 'Education', 'Groceries',
        'Fuel', 'EMI & Loans', 'Insurance', 'Investment', 'Transfer',
        'Income', 'Recharge & Subscriptions', 'Other',
      ],
      default: 'Other',
    },
    plainLanguage: { type: String, required: true },
    rawDescription: { type: String, required: true },
    source: {
      type: String,
      enum: ['UPI', 'NEFT', 'IMPS', 'RTGS', 'CARD', 'WALLET', 'NETBANKING', 'CASH', 'OTHER'],
      required: true,
    },
    sourceName: { type: String, required: true, trim: true },
    merchantName: { type: String, trim: true },
    upiId: { type: String, trim: true, lowercase: true },
    bankReference: { type: String, trim: true },
    date: { type: Date, required: true, index: true },
    isRecurring: { type: Boolean, default: false },
    tags: [{ type: String, trim: true, lowercase: true }],
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, source: 1 });
transactionSchema.index({ rawDescription: 'text', plainLanguage: 'text' });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
