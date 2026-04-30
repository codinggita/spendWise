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
        amount: data.type === 'debit' ? -Math.abs(data.amount) : Math.abs(data.amount),
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
        <Button className="bg-red-500 hover:bg-red-600 text-white font-bold border-4 border-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          + Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-slate-800 border-slate-600 text-white"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                {...register('type')}
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawDescription">Description</Label>
            <Input
              id="rawDescription"
              placeholder="e.g., Coffee at Starbucks"
              className="bg-slate-800 border-slate-600 text-white"
              {...register('rawDescription')}
            />
            {errors.rawDescription && (
              <p className="text-red-500 text-sm">{errors.rawDescription.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                {...register('source')}
              >
                {TRANSACTION_SOURCES.map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
              {errors.source && (
                <p className="text-red-500 text-sm">{errors.source.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceName">Source Name</Label>
              <Input
                id="sourceName"
                placeholder="e.g., HDFC Bank"
                className="bg-slate-800 border-slate-600 text-white"
                {...register('sourceName')}
              />
              {errors.sourceName && (
                <p className="text-red-500 text-sm">{errors.sourceName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              className="bg-slate-800 border-slate-600 text-white"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
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
              onClick={() => setOpen(false)}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white border-4 border-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
