import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TRANSACTION_CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Utilities & Bills', 'Entertainment',
  'Healthcare', 'Travel', 'Education', 'Groceries', 'Fuel', 'EMI & Loans',
  'Insurance', 'Investment', 'Transfer', 'Income', 'Recharge & Subscriptions', 'Other',
] as const;

const TRANSACTION_SOURCES = ['UPI', 'NEFT', 'IMPS', 'RTGS', 'CARD', 'WALLET', 'NETBANKING', 'CASH', 'OTHER'] as const;

export interface TransactionFilters {
  category?: string;
  source?: string;
  type?: 'debit' | 'credit';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  isRecurring?: boolean;
}

interface TransactionFiltersProps {
  onFiltersChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export const TransactionFilters = ({ onFiltersChange, onClear }: TransactionFiltersProps) => {
  const [category, setCategory] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  const handleApplyFilters = () => {
    const filters: TransactionFilters = {};
    if (category) filters.category = category;
    if (source) filters.source = source;
    if (type) filters.type = type as 'debit' | 'credit';
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minAmount) filters.minAmount = parseFloat(minAmount);
    if (maxAmount) filters.maxAmount = parseFloat(maxAmount);
    if (search) filters.search = search;
    if (isRecurring) filters.isRecurring = isRecurring;
    onFiltersChange(filters);
  };

  const handleClear = () => {
    setCategory('');
    setSource('');
    setType('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setSearch('');
    setIsRecurring(false);
    onClear();
  };

  return (
    <div className="bg-card border-2 border-black p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs font-bold uppercase tracking-widest">Search</Label>
          <Input
            id="search"
            placeholder="Search transactions..."
            className="neo-input w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest">Category</Label>
          <select
            id="category"
            className="neo-input w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source" className="text-xs font-bold uppercase tracking-widest">Source</Label>
          <select
            id="source"
            className="neo-input w-full"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">All Sources</option>
            {TRANSACTION_SOURCES.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-xs font-bold uppercase tracking-widest">Type</Label>
          <select
            id="type"
            className="neo-input w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-xs font-bold uppercase tracking-widest">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            className="neo-input w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-xs font-bold uppercase tracking-widest">End Date</Label>
          <Input
            id="endDate"
            type="date"
            className="neo-input w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAmount" className="text-xs font-bold uppercase tracking-widest">Min Amount</Label>
          <Input
            id="minAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="neo-input w-full"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxAmount" className="text-xs font-bold uppercase tracking-widest">Max Amount</Label>
          <Input
            id="maxAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="neo-input w-full"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            id="isRecurring"
            type="checkbox"
            className="w-4 h-4 border-2 border-black rounded-none bg-background checked:bg-primary"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <Label htmlFor="isRecurring" className="cursor-pointer text-xs font-bold uppercase tracking-widest">Recurring Only</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t-2 border-black">
        <Button
          onClick={handleApplyFilters}
          className="neo-btn bg-destructive text-destructive-foreground border-2 border-black"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="neo-btn bg-background text-foreground border-2 border-black"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
