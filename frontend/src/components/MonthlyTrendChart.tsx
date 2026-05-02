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
  monthLabel: string;
  totalDebit: number;
  totalCredit: number;
}

interface MonthlyTrendChartProps {
  data: TrendData[];
}

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.2} />
        <XAxis 
          dataKey="monthLabel" 
          stroke="var(--foreground)"
          tick={{ fill: 'var(--foreground)', fontSize: 10 }}
        />
        <YAxis 
          stroke="var(--foreground)"
          tick={{ fill: 'var(--foreground)', fontSize: 10 }}
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
            backgroundColor: 'var(--card)',
            border: '2px solid var(--border)',
            borderRadius: '0px',
            color: 'var(--foreground)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
        />
        <Line
          type="monotone"
          dataKey="totalDebit"
          name="Spending"
          stroke="var(--expense)"
          strokeWidth={4}
          dot={{ fill: 'var(--expense)', r: 4, strokeWidth: 2, stroke: 'black' }}
          activeDot={{ r: 6, fill: 'var(--expense)', stroke: 'black', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="totalCredit"
          name="Income"
          stroke="var(--income)"
          strokeWidth={4}
          dot={{ fill: 'var(--income)', r: 4, strokeWidth: 2, stroke: 'black' }}
          activeDot={{ r: 6, fill: 'var(--income)', stroke: 'black', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};