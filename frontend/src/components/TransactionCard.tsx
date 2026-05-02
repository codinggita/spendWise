import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, ArrowUpLeft, ArrowDownRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Transaction, deleteTransaction } from '@/store/slices/transactionSlice';
import { EditTransactionModal } from './EditTransactionModal';
import { AppDispatch } from '@/store';
import { toast } from '@/components/ui/use-toast';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = forwardRef<HTMLDivElement, TransactionCardProps>(
  ({ transaction }, ref) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
    };

    const isDebit = transaction.type === 'debit';

    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        try {
          await dispatch(deleteTransaction(transaction._id)).unwrap();
          toast({
            title: 'Success',
            description: 'Transaction deleted successfully',
          });
        } catch (error: any) {
          toast({
            title: 'Error',
            description: error || 'Failed to delete transaction',
            variant: 'destructive',
          });
        }
      }
    };

    return (
      <>
        <motion.div
          ref={ref}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-card border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          role="article"
          aria-label={`${isDebit ? 'Expense' : 'Income'} transaction: ${transaction.plainLanguage}, ${formatAmount(transaction.amount)}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-black text-foreground truncate uppercase tracking-tight">
                  {transaction.plainLanguage}
                </h3>
                {transaction.isRecurring && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 border border-black uppercase tracking-widest">
                    Recurring
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span className="bg-surface-high border border-black px-2 py-0.5 text-foreground">
                  {transaction.sourceName || transaction.source}
                </span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
              <p
                className={`text-xl font-black flex items-center gap-1 ${
                  isDebit ? 'text-expense' : 'text-income'
                }`}
                aria-label={`${isDebit ? 'Expense' : 'Income'}: ${isDebit ? '-' : '+'}${formatAmount(Math.abs(transaction.amount))}`}
                title={`${isDebit ? 'Expense (money spent)' : 'Income (money received)'}`}
              >
                {isDebit ? (
                  <ArrowUpLeft className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
                )}
                {isDebit ? '-' : '+'}{formatAmount(Math.abs(transaction.amount))}
              </p>
              <div className="flex items-center gap-1">
                <span className="bg-tertiary text-tertiary-foreground text-[10px] font-black px-2 py-0.5 border border-black uppercase tracking-widest">
                  {transaction.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 border-2 border-black bg-background hover:bg-surface-high shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 border-2 border-black bg-background text-destructive hover:bg-destructive/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <EditTransactionModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          transaction={transaction}
        />
      </>
    );
  }
);

TransactionCard.displayName = 'TransactionCard';