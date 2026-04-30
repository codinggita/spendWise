import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SpendingPieChart } from '@/components/SpendingPieChart';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import api from '@/services/api';

interface CategoryData {
  _id: string;
  total: number;
  count?: number;
}

interface TrendData {
  month: string;
  total: number;
}

interface DashboardSummary {
  totalSpent: number;
  totalIncome: number;
  transactionCount: number;
  averageTransaction: number;
}

export const DashboardPage = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashboardRes, categoriesRes, trendRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/categories'),
          api.get('/analytics/monthly-trend'),
        ]);
        setSummary(dashboardRes.data.data);
        setCategoryData(categoriesRes.data.data || []);
        setTrendData(trendRes.data.data || []);
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
    }).format(amount);
  };

  const totalSpent = summary?.totalSpent ?? 0;

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
          <p className="text-sm mt-2 text-slate-400">Loading your spending data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6 h-48 sm:h-64 animate-pulse" />
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6 h-48 sm:h-64 animate-pulse" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        </div>
        <div className="bg-slate-900 border border-red-500 rounded-lg p-4 sm:p-6">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-sm mt-2 text-slate-400">Understand your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Spending by Category</h2>
          {categoryData.length > 0 ? (
            <SpendingPieChart data={categoryData} />
          ) : (
            <p className="text-slate-400 text-center py-8">No spending data yet. Import some transactions!</p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Top Categories</h2>
          <div className="space-y-4">
            {categoryData.length > 0 ? (
              categoryData.slice(0, 5).map((item) => {
                const percentage = totalSpent > 0 ? (Math.abs(item.total) / Math.abs(totalSpent)) * 100 : 0;
                return (
                  <div key={item._id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{item._id}</span>
                      <span className="font-bold text-amber-500">
                        {formatAmount(Math.abs(item.total))}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{percentage.toFixed(1)}% of total</p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center py-8">No categories to display</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Monthly Trend</h2>
        {trendData.length > 0 ? (
          <MonthlyTrendChart data={trendData} />
        ) : (
          <p className="text-slate-400 text-center py-8">Not enough data for trends yet</p>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-2">Total Spent This Month</h2>
        <p className="text-4xl sm:text-5xl font-bold text-red-500">
          {formatAmount(Math.abs(totalSpent))}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {summary?.transactionCount ?? 0} transactions
        </p>
      </div>
    </motion.div>
  );
};

export default DashboardPage;