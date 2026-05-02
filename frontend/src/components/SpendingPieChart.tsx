import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#ddb7ff', '#4cd7f6', '#e2c62d', '#ff9f1c', '#2ec4b6', '#e71d36'];

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
    value: Math.abs(item.total),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="black"
          strokeWidth={2}
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
              maximumFractionDigits: 0,
            }).format(value)
          }
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '2px solid var(--border)',
            borderRadius: '0px',
            color: 'var(--foreground)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="rect"
          formatter={(value) => <span className="text-[10px] font-bold uppercase text-foreground/70">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};