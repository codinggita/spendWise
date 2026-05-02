import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import { SpendingPieChart } from '@/components/SpendingPieChart';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import { TransactionLegend } from '@/components/TransactionLegend';
import api from '@/services/api';

interface CategoryData {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface TrendData {
  monthLabel: string;
  totalDebit: number;
  totalCredit: number;
}

interface DashboardSummary {
  currentMonthSpend: number;
  currentMonthIncome: number;
  totalTransactions: number;
  avgDailySpend: number;
  topCategory: string;
  budgetUtilization: number;
  savingsRate: number;
  lastMonthSpend: number;
}

interface SourceData {
  source: string;
  total: number;
  count: number;
  percentage: number;
}

interface MerchantData {
  merchant: string;
  total: number;
  count: number;
}

export const DashboardPage = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [merchantData, setMerchantData] = useState<MerchantData[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashboardRes, categoriesRes, trendRes, sourcesRes, merchantsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/categories'),
          api.get('/analytics/monthly-trend'),
          api.get('/analytics/sources'),
          api.get('/analytics/top-merchants'),
        ]);
        setSummary(dashboardRes.data.data);
        setCategoryData(categoriesRes.data.data || []);
        setTrendData(trendRes.data.data || []);
        setSourceData(sourcesRes.data.data || []);
        setMerchantData(merchantsRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalSpent = summary?.currentMonthSpend ?? 0;

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 h-32 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 h-80 animate-pulse" />
          <div className="bg-card border border-border rounded-lg p-6 h-80 animate-pulse" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-card border-2 border-destructive rounded-lg p-6">
          <p className="text-destructive font-bold">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm mt-1 text-muted-foreground">Welcome back to SpendWise</p>
        </div>
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-none border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-expense border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" role="region" aria-label="Total expenses this month">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Total Spent</p>
            <TrendingDown className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-white mt-1" aria-label={`Total expenses: ${formatAmount(totalSpent)}`}>{formatAmount(totalSpent)}</p>
          <p className="text-xs font-bold text-white/70 mt-2">
            {summary?.totalTransactions} transactions
          </p>
        </div>
        <div className="bg-income border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" role="region" aria-label="Total income this month">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Income</p>
            <TrendingUp className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-white mt-1" aria-label={`Total income: ${formatAmount(summary?.currentMonthIncome ?? 0)}`}>{formatAmount(summary?.currentMonthIncome ?? 0)}</p>
          <p className="text-xs font-bold text-white/70 mt-2">
            Savings: {summary?.savingsRate}%
          </p>
        </div>
        <div className="bg-expense/10 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" role="region" aria-label="Budget utilization percentage">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Budget Used</p>
            <Target className="h-4 w-4 text-expense" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-expense mt-1" aria-label={`Budget utilization: ${summary?.budgetUtilization}%`}>{summary?.budgetUtilization}%</p>
          <p className="text-xs font-bold text-foreground/70 mt-2">
            Top: {summary?.topCategory}
          </p>
        </div>
        <div className="bg-expense/10 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" role="region" aria-label="Average daily spending">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Daily Avg</p>
            <Calendar className="h-4 w-4 text-expense" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-expense mt-1" aria-label={`Average daily spend: ${formatAmount(summary?.avgDailySpend ?? 0)}`}>{formatAmount(summary?.avgDailySpend ?? 0)}</p>
          <p className="text-xs font-bold text-foreground/70 mt-2">
            vs Last Month: {formatAmount(summary?.lastMonthSpend ?? 0)}
          </p>
        </div>
      </div>

      {/* Transaction Color Coding Legend */}
      <div className="bg-surface-low border-2 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <TransactionLegend />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <div className="bg-card border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Spending by Category</h2>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <SpendingPieChart data={categoryData.map(c => ({ _id: c.category, total: c.total }))} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">No data available</div>
            )}
          </div>
        </div>

        {/* Top Categories List */}
        <div className="bg-card border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Category Breakdown</h2>
          <div className="space-y-4">
            {categoryData.length > 0 ? (
              categoryData.slice(0, 5).map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-foreground uppercase">{item.category}</span>
                    <span className="text-expense">{formatAmount(item.total)}</span>
                  </div>
                  <div className="h-3 bg-background border border-black overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      className="h-full bg-expense"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <span>{item.count} txns</span>
                    <span>{item.percentage}% of total</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground italic">No categories to display</div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Cash Flow Trend</h2>
        <div className="h-80">
          {trendData.length > 0 ? (
            <MonthlyTrendChart data={trendData} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground italic">Insufficient data for trends</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Breakdown */}
        <div className="bg-card border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Spending by Source</h2>
          <div className="h-64">
            {sourceData.length > 0 ? (
              <SpendingPieChart data={sourceData.map(s => ({ _id: s.source, total: s.total }))} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">No source data</div>
            )}
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-card border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Top Merchants</h2>
          <div className="space-y-4">
            {merchantData.length > 0 ? (
              merchantData.slice(0, 5).map((item) => (
                <div key={item.merchant} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-foreground uppercase truncate max-w-[150px]">{item.merchant}</span>
                    <span className="text-expense">{formatAmount(item.total)}</span>
                  </div>
                  <div className="h-3 bg-background border border-black overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.total / totalSpent) * 100)}%` }}
                      className="h-full bg-expense"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground italic">No merchant data yet</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;