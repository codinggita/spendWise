import Papa from 'papaparse';
import { bulkCreateTransactions } from './transactionService';
import { AppError } from '../utils/AppError';
import { TransactionSource, TransactionType } from '../models/Transaction';
import logger from '../utils/logger';

type BankFormat = 'HDFC' | 'SBI' | 'ICICI' | 'AXIS' | 'KOTAK' | 'GENERIC';

interface RawCSVRow {
  [key: string]: string;
}

interface ParsedTransaction {
  amount: number;
  type: TransactionType;
  rawDescription: string;
  source: TransactionSource;
  sourceName: string;
  date: string;
  merchantName?: string;
  upiId?: string;
  bankReference?: string;
  currency: string;
  isRecurring?: boolean;
  tags?: string[];
  notes?: string;
}

const detectBankFormat = (headers: string[]): BankFormat => {
  const h = headers.map((x) => x.toLowerCase().trim());
  if (h.includes('narration') && h.includes('chq./ref.no.')) return 'HDFC';
  if (h.includes('txn date') && h.includes('description') && h.includes('ref no./cheque no.')) return 'SBI';
  if (h.includes('transaction date') && h.includes('transaction remarks')) return 'ICICI';
  if (h.includes('tran date') && h.includes('particulars')) return 'AXIS';
  if (h.includes('transaction date') && h.includes('description') && h.includes('cheque number')) return 'KOTAK';
  return 'GENERIC';
};

const parseAmount = (val: string): number => {
  const cleaned = val.replace(/[₹,\s]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
};

const parseDate = (val: string): string => {
  val = val.trim();
  const ddmmyyyy = val.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  const ddmmyy = val.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{2})$/);
  if (ddmmyy) return `20${ddmmyy[3]}-${ddmmyy[2]}-${ddmmyy[1]}`;
  const isoDate = val.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoDate) return isoDate[0];
  return new Date().toISOString().split('T')[0];
};

const detectSource = (description: string): TransactionSource => {
  const d = description.toUpperCase();
  if (d.includes('UPI') || d.includes('@')) return 'UPI';
  if (d.includes('NEFT')) return 'NEFT';
  if (d.includes('IMPS')) return 'IMPS';
  if (d.includes('RTGS')) return 'RTGS';
  if (d.includes('ATM') || d.includes('POS') || d.includes('CARD') || d.includes('DEBIT CARD') || d.includes('CREDIT CARD')) return 'CARD';
  if (d.includes('PAYTM') || d.includes('PHONEPE') || d.includes('AMAZON PAY') || d.includes('MOBIKWIK') || d.includes('FREECHARGE')) return 'WALLET';
  if (d.includes('NETBANKING') || d.includes('NET BANKING') || d.includes('INTERNET BANKING')) return 'NETBANKING';
  return 'OTHER';
};

const extractUpiId = (description: string): string | undefined => {
  const match = description.match(/[\w.\-_]+@[\w.\-_]+/);
  return match ? match[0].toLowerCase() : undefined;
};

const parseHDFC = (row: RawCSVRow): ParsedTransaction | null => {
  const narration = row['Narration'] || row['narration'] || '';
  const debit = parseAmount(row['Withdrawal Amt.'] || row['Debit'] || '0');
  const credit = parseAmount(row['Deposit Amt.'] || row['Credit'] || '0');
  const date = parseDate(row['Date'] || row['date'] || '');
  const ref = row['Chq./Ref.No.'] || row['chq./ref.no.'] || '';

  if (!narration || (!debit && !credit)) return null;

  return {
    amount: debit > 0 ? debit : credit,
    type: debit > 0 ? 'debit' : 'credit',
    rawDescription: narration,
    source: detectSource(narration),
    sourceName: 'HDFC Bank',
    date,
    upiId: extractUpiId(narration),
    bankReference: ref,
    currency: 'INR',
  };
};

const parseSBI = (row: RawCSVRow): ParsedTransaction | null => {
  const description = row['Description'] || row['description'] || '';
  const debit = parseAmount(row['Debit'] || '0');
  const credit = parseAmount(row['Credit'] || '0');
  const date = parseDate(row['Txn Date'] || row['txn date'] || '');
  const ref = row['Ref No./Cheque No.'] || '';

  if (!description || (!debit && !credit)) return null;

  return {
    amount: debit > 0 ? debit : credit,
    type: debit > 0 ? 'debit' : 'credit',
    rawDescription: description,
    source: detectSource(description),
    sourceName: 'State Bank of India',
    date,
    upiId: extractUpiId(description),
    bankReference: ref,
    currency: 'INR',
  };
};

const parseICICI = (row: RawCSVRow): ParsedTransaction | null => {
  const remarks = row['Transaction Remarks'] || row['transaction remarks'] || '';
  const debit = parseAmount(row['Withdrawal Amount (INR )'] || row['Debit Amount'] || '0');
  const credit = parseAmount(row['Deposit Amount (INR )'] || row['Credit Amount'] || '0');
  const date = parseDate(row['Transaction Date'] || row['transaction date'] || '');

  if (!remarks || (!debit && !credit)) return null;

  return {
    amount: debit > 0 ? debit : credit,
    type: debit > 0 ? 'debit' : 'credit',
    rawDescription: remarks,
    source: detectSource(remarks),
    sourceName: 'ICICI Bank',
    date,
    upiId: extractUpiId(remarks),
    currency: 'INR',
  };
};

const parseAxis = (row: RawCSVRow): ParsedTransaction | null => {
  const particulars = row['Particulars'] || row['particulars'] || '';
  const debit = parseAmount(row['Debit'] || row['debit'] || '0');
  const credit = parseAmount(row['Credit'] || row['credit'] || '0');
  const date = parseDate(row['Tran Date'] || row['tran date'] || '');

  if (!particulars || (!debit && !credit)) return null;

  return {
    amount: debit > 0 ? debit : credit,
    type: debit > 0 ? 'debit' : 'credit',
    rawDescription: particulars,
    source: detectSource(particulars),
    sourceName: 'Axis Bank',
    date,
    upiId: extractUpiId(particulars),
    currency: 'INR',
  };
};

const parseGeneric = (row: RawCSVRow): ParsedTransaction | null => {
  const description =
    row['Description'] || row['Narration'] || row['Particulars'] || row['Remarks'] ||
    row['description'] || row['narration'] || '';
  const debit = parseAmount(
    row['Debit'] || row['Withdrawal'] || row['Amount'] || row['debit'] || '0'
  );
  const credit = parseAmount(
    row['Credit'] || row['Deposit'] || row['credit'] || '0'
  );
  const date = parseDate(
    row['Date'] || row['Transaction Date'] || row['Txn Date'] || row['date'] || ''
  );

  if (!description || (!debit && !credit)) return null;

  // Extract extra fields if available
  const isRecurring = row['Is Recurring']?.toLowerCase() === 'true' || row['isRecurring']?.toLowerCase() === 'true';
  const tags = row['Tags'] || row['tags'] ? (row['Tags'] || row['tags']).split(',').map(t => t.trim()).filter(t => t) : undefined;
  const notes = row['Notes'] || row['notes'] || undefined;

  return {
    amount: debit > 0 ? debit : credit,
    type: debit > 0 ? 'debit' : 'credit',
    rawDescription: description,
    source: detectSource(description),
    sourceName: 'Bank',
    date,
    upiId: extractUpiId(description),
    currency: 'INR',
    isRecurring,
    tags,
    notes,
  };
};

const parseRow = (row: RawCSVRow, format: BankFormat): ParsedTransaction | null => {
  switch (format) {
    case 'HDFC': return parseHDFC(row);
    case 'SBI': return parseSBI(row);
    case 'ICICI': return parseICICI(row);
    case 'AXIS': return parseAxis(row);
    default: return parseGeneric(row);
  }
};

export const processCSVImport = async (
  userId: string,
  fileBuffer: Buffer,
  filename: string
): Promise<{ created: number; failed: number; skipped: number; format: string }> => {
  const csvString = fileBuffer.toString('utf-8');

  const parsed = Papa.parse<RawCSVRow>(csvString, {
    header: true,
    skipEmptyLines: true,
    comments: '#',
    transformHeader: (h: string) => h.trim(),
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new AppError('Invalid CSV file format', 400);
  }

  const headers = Object.keys(parsed.data[0] || {});
  const format = detectBankFormat(headers);
  logger.info(`CSV import: detected format ${format} for file ${filename}`);

  const transactions: ParsedTransaction[] = [];
  let skipped = 0;

  for (const row of parsed.data) {
    const tx = parseRow(row, format);
    if (tx && tx.amount > 0) {
      transactions.push(tx);
    } else {
      skipped++;
    }
  }

  if (transactions.length === 0) {
    throw new AppError('No valid transactions found in the CSV file', 400);
  }

  const { created, failed } = await bulkCreateTransactions(userId, transactions);

  return { created, failed, skipped, format };
};
