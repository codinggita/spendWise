import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { RootState, AppDispatch } from '@/store';
import { fetchTransactions } from '@/store/slices/transactionSlice';
import { TransactionCard } from '@/components/TransactionCard';
import { EmptyStateAnimation } from '@/components/LoadingAnimation';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { TransactionFilters, TransactionFilters as TransactionFiltersType } from '@/components/TransactionFilters';
import { Pagination } from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

export const TransactionFeedPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error, totalPages, hasNextPage, hasPrevPage } = useSelector(
    (state: RootState) => state.transactions
  );
  const [filters, setFilters] = useState<TransactionFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search || '', 500);

  useEffect(() => {
    dispatch(fetchTransactions({
      page: currentPage,
      ...filters,
      search: debouncedSearch || undefined,
    }));
  }, [dispatch, currentPage, filters, debouncedSearch]);

  const handleFiltersChange = (newFilters: TransactionFiltersType) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setFilters({});
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Transactions
          </h1>
          <p className="text-sm mt-2 text-slate-400">
            Track your spending in plain language
          </p>
        </div>
        <AddTransactionModal />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-2">
          This Month
        </h2>
        <p className="text-3xl sm:text-4xl font-bold text-red-500">
          -{formatAmount(Math.abs(totalSpent))}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {transactions.length} transactions
        </p>
      </div>

      <TransactionFilters onFiltersChange={handleFiltersChange} onClear={handleClearFilters} />

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-900 border border-slate-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-slate-900 border border-red-500 rounded-lg p-6">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-12 text-center">
          <EmptyStateAnimation className="mb-4" />
          <p className="text-slate-400">
            No transactions found. Import a bank statement to get started!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction._id} transaction={transaction} />
              ))}
            </AnimatePresence>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default TransactionFeedPage;