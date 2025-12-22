import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NPSChartProps {
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
}

export function NPSChart({ promoters, passives, detractors, npsScore }: NPSChartProps) {
  const data = [
    { name: 'Promoters (9-10)', value: promoters, color: '#10b981' },
    { name: 'Passives (7-8)', value: passives, color: '#f59e0b' },
    { name: 'Detractors (0-6)', value: detractors, color: '#ef4444' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-success';
    if (score >= 0) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-neutral-600 mb-2">Net Promoter Score</p>
        <p className={`text-5xl font-bold ${getScoreColor(npsScore)}`}>
          {npsScore}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {npsScore >= 50 ? 'Excellent' : npsScore >= 0 ? 'Good' : 'Needs Improvement'}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name?: string; percent?: number }) => `${name?.split(' ')[0]}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
