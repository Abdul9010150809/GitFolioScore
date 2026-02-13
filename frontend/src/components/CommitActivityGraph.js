import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

const AREA_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-sm" style={{ backdropFilter: 'blur(12px)' }}>
      <p className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Week {label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-xs" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.dataKey}: <b>{p.value}</b> commits
        </p>
      ))}
    </div>
  );
};

function CommitActivityGraph({ commitActivity }) {
  if (!commitActivity || typeof commitActivity !== 'object' || Object.keys(commitActivity).length === 0) {
    return null;
  }

  // Transform data - each repo has weekly commit data
  const repoNames = Object.keys(commitActivity);
  const maxWeeks = Math.max(...repoNames.map(r => (commitActivity[r] || []).length));

  const data = [];
  for (let i = 0; i < maxWeeks; i++) {
    const point = { week: `W${i + 1}` };
    repoNames.forEach(repo => {
      point[repo] = commitActivity[repo]?.[i] ?? 0;
    });
    data.push(point);
  }

  return (
    <div className="premium-card p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Commit Activity</h3>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Weekly commits across top repositories (last 12 weeks)
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            {repoNames.map((repo, i) => (
              <linearGradient key={repo} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AREA_COLORS[i % AREA_COLORS.length]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={AREA_COLORS[i % AREA_COLORS.length]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {repoNames.map((repo, i) => (
            <Area
              key={repo}
              type="monotone"
              dataKey={repo}
              stroke={AREA_COLORS[i % AREA_COLORS.length]}
              strokeWidth={2}
              fill={`url(#grad-${i})`}
              animationDuration={1500}
              animationBegin={i * 200}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {repoNames.map((repo, i) => (
          <span key={repo} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-3 h-3 rounded" style={{ background: AREA_COLORS[i % AREA_COLORS.length] }} />
            {repo}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CommitActivityGraph;
