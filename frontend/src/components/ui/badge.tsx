import { cn } from '@/lib/utils';

interface BadgeProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Badge({ className, variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-amber-500/20 text-amber-400',
    secondary: 'bg-slate-700 text-slate-300',
    outline: 'border border-slate-600 text-slate-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}