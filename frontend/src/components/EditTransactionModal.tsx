import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateTransaction } from '@/store/slices/transactionSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const TRANSACTION_CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Utilities & Bills', 'Entertainment',
  'Healthcare', 'Travel', 'Education', 'Groceries', 'Fuel', 'EMI & Loans',
  'Insurance', 'Investment', 'Transfer', 'Income', 'Recharge & Subscriptions', 'Other',
] as const;

const updateTransactionSchema = z.object({
  category: z.enum(TRANSACTION_CATEGORIES),
  notes: z.string().max(500).optional(),
  isRecurring: z.boolean().optional(),
  merchantName: z.string().max(100).optional(),
});

type FormData = z.infer<typeof updateTransactionSchema>;

interface EditTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    _id: string;
    category: string;
    notes?: string;
    isRecurring?: boolean;
    merchantName?: string;
  };
}

export const EditTransactionModal = ({ open, onOpenChange, transaction }: EditTransactionModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.transactions);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      category: transaction.category as any,
      notes: transaction.notes || '',
      isRecurring: transaction.isRecurring || false,
      merchantName: transaction.merchantName || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(updateTransaction({
        id: transaction._id,
        data: {
          category: data.category,
          notes: data.notes,
          isRecurring: data.isRecurring,
          merchantName: data.merchantName,
        },
      })).unwrap();

      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to update transaction',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
              {...register('category')}
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantName">Merchant Name (Optional)</Label>
            <Input
              id="merchantName"
              placeholder="e.g., Starbucks"
              className="bg-slate-800 border-slate-600 text-white"
              {...register('merchantName')}
            />
            {errors.merchantName && (
              <p className="text-red-500 text-sm">{errors.merchantName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Additional notes..."
              className="bg-slate-800 border-slate-600 text-white"
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isRecurring"
              type="checkbox"
              className="w-4 h-4 bg-slate-800 border-slate-600 rounded"
              {...register('isRecurring')}
            />
            <Label htmlFor="isRecurring" className="cursor-pointer">Recurring Transaction</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white border-4 border-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
