import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  month: string;
  total: number;
}

interface MonthlyTrendChartProps {
  data: TrendData[];
}

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="month" 
          stroke="#CBD5E1"
          tick={{ fill: '#CBD5E1' }}
        />
        <YAxis 
          stroke="#CBD5E1"
          tick={{ fill: '#CBD5E1' }}
          tickFormatter={(value) =>
            new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(value)
          }
          contentStyle={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#CBD5E1',
          }}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ fill: '#F59E0B', r: 4 }}
          activeDot={{ r: 8, fill: '#F59E0B' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};