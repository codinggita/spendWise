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
import { TransactionLegend } from '@/components/TransactionLegend';
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

  const totalBalance = transactions.reduce((sum, t) => {
    const amount = Math.abs(t.amount);
    return t.type === 'debit' ? sum - amount : sum + amount;
  }, 0);
  const isNegative = totalBalance < 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Transactions
          </h1>
          <p className="text-sm mt-2 text-muted-foreground">
            Track your spending in plain language
          </p>
        </div>
        <AddTransactionModal />
      </div>

      <div className="bg-card border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" role="region" aria-label="Monthly Balance Summary">
        <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-tight mb-2">
          This Month's Balance
        </h2>
        <p
          className={`text-3xl sm:text-4xl font-black ${isNegative ? 'text-expense' : 'text-income'}`}
          aria-label={`Current balance: ${isNegative ? 'Deficit' : 'Surplus'} of ${formatAmount(Math.abs(totalBalance))}`}
          title={`${isNegative ? 'You spent more than you earned' : 'You earned more than you spent'}`}
        >
          {isNegative ? '-' : '+'}{formatAmount(Math.abs(totalBalance))}
        </p>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
          {transactions.length} transactions
        </p>
      </div>

      {/* Transaction Color Coding Legend */}
      <div className="bg-surface-low border-2 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <TransactionLegend />
      </div>

      <TransactionFilters onFiltersChange={handleFiltersChange} onClear={handleClearFilters} />

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-card border-2 border-black animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-card border-2 border-destructive p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-destructive font-bold uppercase">{error}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-card border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <EmptyStateAnimation className="mb-4" />
          <p className="text-muted-foreground font-bold italic">
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