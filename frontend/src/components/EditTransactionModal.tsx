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
  DialogDescription,
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
      <DialogContent className="bg-background border-4 border-black text-foreground sm:max-w-[500px] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black font-['Lexend'] uppercase">Edit Transaction</DialogTitle>
          <DialogDescription className="text-muted-foreground font-['Public_Sans']">
            Update the details of your transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest">Category</Label>
            <select
              id="category"
              className="neo-input w-full"
              {...register('category')}
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-destructive text-xs font-bold uppercase">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantName" className="text-xs font-bold uppercase tracking-widest">Merchant Name (Optional)</Label>
            <Input
              id="merchantName"
              placeholder="e.g., Starbucks"
              className="neo-input w-full"
              {...register('merchantName')}
            />
            {errors.merchantName && (
              <p className="text-destructive text-xs font-bold uppercase">{errors.merchantName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Additional notes..."
              className="neo-input w-full"
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-destructive text-xs font-bold uppercase">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 p-2 border-2 border-black bg-surface-low">
            <input
              id="isRecurring"
              type="checkbox"
              className="w-4 h-4 border-2 border-black rounded-none bg-background checked:bg-primary"
              {...register('isRecurring')}
            />
            <Label htmlFor="isRecurring" className="cursor-pointer text-xs font-bold uppercase tracking-widest">Recurring Transaction</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="neo-btn bg-background text-foreground hover:bg-surface-high border-2 border-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="neo-btn bg-primary text-primary-foreground border-2 border-black hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
