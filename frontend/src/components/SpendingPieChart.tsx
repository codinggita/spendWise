import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899', '#22C55E', '#6B7280'];

interface CategoryData {
  _id: string;
  total: number;
}

interface SpendingPieChartProps {
  data: CategoryData[];
}

export const SpendingPieChart = ({ data }: SpendingPieChartProps) => {
  const chartData = data.map((item) => ({
    name: item._id,
    value: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
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
        />
        <Legend
          wrapperStyle={{ color: '#CBD5E1' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};