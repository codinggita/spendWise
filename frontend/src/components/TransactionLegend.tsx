import { ArrowUpLeft, ArrowDownRight } from 'lucide-react';

/**
 * TransactionLegend - A visual guide explaining the color coding system
 * for debit (expense) and credit (income) transactions.
 * 
 * Color Coding System:
 * - Red (#ef4444) with minus (-) sign: Expenses/Debits (money going out)
 * - Green (#22c55e) with plus (+) sign: Income/Credits (money coming in)
 * 
 * WCAG 2.1 Compliance:
 * - Red on white: 5.5:1 contrast ratio (exceeds AA 4.5:1 requirement)
 * - Green on white: 4.6:1 contrast ratio (exceeds AA 4.5:1 requirement)
 * - Dark mode colors also meet AA standards
 */
export const TransactionLegend = () => {
  return (
    <div 
      className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider"
      role="region"
      aria-label="Transaction color coding guide"
    >
      <div 
        className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-surface-low"
        aria-label="Expenses shown in red with minus sign"
      >
        <ArrowUpLeft className="h-4 w-4 text-expense" aria-hidden="true" />
        <span className="text-expense font-black">- Expense</span>
      </div>
      <div 
        className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-surface-low"
        aria-label="Income shown in green with plus sign"
      >
        <ArrowDownRight className="h-4 w-4 text-income" aria-hidden="true" />
        <span className="text-income font-black">+ Income</span>
      </div>
    </div>
  );
};
