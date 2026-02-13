import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Code2 } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#f97316', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-2 text-sm" style={{ backdropFilter: 'blur(12px)' }}>
      <span className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</span>
      <span style={{ color: 'var(--text-muted)' }}> — {payload[0].value}%</span>
    </div>
  );
};

function LanguageChart({ languages }) {
  if (!languages || (Array.isArray(languages) && languages.length === 0) || (!Array.isArray(languages) && Object.keys(languages).length === 0)) return null;

  let processedData = [];
  if (Array.isArray(languages)) {
    const total = languages.reduce((sum, item) => sum + item.count, 0);
    processedData = languages.map((item) => ({
      name: String(item.lang || 'Unknown'),
      value: total > 0 ? Math.round((item.count / total) * 100) : 0,
      rawCount: item.count
    }));
  } else {
    // Fallback for object format (though backend sends array now)
    const entries = Object.entries(languages);
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    processedData = entries.map(([lang, count]) => ({
      name: lang,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      rawCount: count
    }));
  }

  const data = processedData
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map((item, i) => ({
      ...item,
      fill: COLORS[i % COLORS.length],
    }));

  return (
    <div className="premium-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Language Distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={3}
            cornerRadius={5}
            animationBegin={300}
            animationDuration={1000}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '13px', color: 'var(--text-secondary)' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Language pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {data.slice(0, 5).map((lang, i) => (
          <span
            key={lang.name}
            className="badge text-xs font-semibold"
            style={{ background: `${lang.fill}15`, color: lang.fill }}
          >
            {lang.name} · {lang.value}%
          </span>
        ))}
      </div>
    </div>
  );
}

export default LanguageChart;
