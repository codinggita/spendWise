import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditTransactionModal } from '@/components/EditTransactionModal';
import { deleteTransaction } from '@/store/slices/transactionSlice';
import { RootState, AppDispatch } from '@/store';
import { toast } from '@/components/ui/use-toast';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  plainLanguage: string;
  rawDescription: string;
  source: string;
  sourceName: string;
  date: string;
  notes?: string;
  isRecurring?: boolean;
  merchantName?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

const categoryColors: Record<string, string> = {
  'Food & Dining': 'bg-orange-500/20 text-orange-400',
  'Housing': 'bg-purple-500/20 text-purple-400',
  'Transport': 'bg-blue-500/20 text-blue-400',
  'Shopping': 'bg-pink-500/20 text-pink-400',
  'Utilities': 'bg-green-500/20 text-green-400',
  'Other': 'bg-gray-500/20 text-gray-400',
};

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.transactions);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.abs(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isDebit = transaction.amount < 0;
  const colorClass = categoryColors[transaction.category] || categoryColors['Other'];

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
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-md transition-shadow bg-slate-900 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-white">
                  {transaction.plainLanguage}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{transaction.sourceName}</Badge>
                  <span className="text-sm text-slate-400">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${isDebit ? 'text-red-500' : 'text-green-500'}`}>
                  {isDebit ? '-' : '+'}{formatAmount(transaction.amount)}
                </p>
                <Badge className={colorClass}>
                  {transaction.category}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-900/50 border-red-700 text-red-400 hover:bg-red-900 hover:text-red-300"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <EditTransactionModal
        open={editOpen}
        onOpenChange={setEditOpen}
        transaction={transaction}
      />
    </>
  );
};