import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTransaction } from '@/store/slices/transactionSlice';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const TRANSACTION_SOURCES = ['UPI', 'NEFT', 'IMPS', 'RTGS', 'CARD', 'WALLET', 'NETBANKING', 'CASH', 'OTHER'] as const;
const TRANSACTION_TYPES = ['debit', 'credit'] as const;

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(TRANSACTION_TYPES),
  rawDescription: z.string().min(1, 'Description is required').max(500),
  source: z.enum(TRANSACTION_SOURCES),
  sourceName: z.string().min(1, 'Source name is required').max(100),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).optional(),
  isRecurring: z.boolean().optional(),
});

type FormData = z.infer<typeof createTransactionSchema>;

export const AddTransactionModal = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.transactions);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'debit',
      source: 'UPI',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(createTransaction({
        amount: Math.abs(data.amount),
        type: data.type,
        rawDescription: data.rawDescription,
        source: data.source,
        sourceName: data.sourceName,
        date: data.date,
        notes: data.notes,
        isRecurring: data.isRecurring,
      })).unwrap();

      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      });

      reset();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to create transaction',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="neo-btn bg-destructive text-destructive-foreground border-4 border-black hover:bg-destructive/90">
          + Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-4 border-black text-foreground sm:max-w-[500px] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black font-['Lexend'] uppercase">Add Transaction</DialogTitle>
          <DialogDescription className="text-muted-foreground font-['Public_Sans']">
            Enter the details of your transaction below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-widest">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="neo-input w-full"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-destructive text-xs font-bold uppercase">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs font-bold uppercase tracking-widest">Type</Label>
              <select
                id="type"
                className="neo-input w-full"
                {...register('type')}
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
              {errors.type && (
                <p className="text-destructive text-xs font-bold uppercase">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawDescription" className="text-xs font-bold uppercase tracking-widest">Description</Label>
            <Input
              id="rawDescription"
              placeholder="e.g., Coffee at Starbucks"
              className="neo-input w-full"
              {...register('rawDescription')}
            />
            {errors.rawDescription && (
              <p className="text-destructive text-xs font-bold uppercase">{errors.rawDescription.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-xs font-bold uppercase tracking-widest">Source</Label>
              <select
                id="source"
                className="neo-input w-full"
                {...register('source')}
              >
                {TRANSACTION_SOURCES.map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
              {errors.source && (
                <p className="text-destructive text-xs font-bold uppercase">{errors.source.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceName" className="text-xs font-bold uppercase tracking-widest">Source Name</Label>
              <Input
                id="sourceName"
                placeholder="e.g., HDFC Bank"
                className="neo-input w-full"
                {...register('sourceName')}
              />
              {errors.sourceName && (
                <p className="text-destructive text-xs font-bold uppercase">{errors.sourceName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-xs font-bold uppercase tracking-widest">Date</Label>
            <Input
              id="date"
              type="date"
              className="neo-input w-full"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-destructive text-xs font-bold uppercase">{errors.date.message}</p>
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
              onClick={() => setOpen(false)}
              className="neo-btn bg-background text-foreground hover:bg-surface-high border-2 border-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="neo-btn bg-destructive text-destructive-foreground border-2 border-black hover:bg-destructive/90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
