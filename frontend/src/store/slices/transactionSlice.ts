import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

interface Transaction {
  _id: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  plainLanguage: string;
  rawDescription: string;
  source: string;
  sourceName: string;
  date: string;
  merchantName?: string;
  upiId?: string;
  tags?: string[];
  isRecurring?: boolean;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (
    params: { page?: number; limit?: number; category?: string; source?: string; type?: string; startDate?: string; endDate?: string; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get('/transactions', { params });
      // Backend returns: { success, data: [...], total, page, limit, totalPages, hasNextPage, hasPrevPage }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (data: {
    amount: number;
    type: 'debit' | 'credit';
    rawDescription: string;
    source: string;
    sourceName: string;
    date: string;
    merchantName?: string;
    upiId?: string;
    notes?: string;
    tags?: string[];
    isRecurring?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions', data);
      return response.data.data.transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data }: {
    id: string;
    data: {
      category?: string;
      notes?: string;
      tags?: string[];
      isRecurring?: boolean;
      merchantName?: string;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/transactions/${id}`, data);
      return response.data.data.transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.transactions = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPrevPage = action.payload.hasPrevPage;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter((t) => t._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
