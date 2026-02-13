import React from 'react';
import { AlertCircle, GitPullRequest, Users, ExternalLink } from 'lucide-react';

function RepoInsights({ repo, insights }) {
  if (!insights) return null;

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="text-lg">📊</span> {repo.name}
        </h4>
        <a
          href={`https://github.com/${repo.full_name || repo.name}`}
          target="_blank" rel="noopener noreferrer"
          className="text-xs flex items-center gap-1 hover:underline"
          style={{ color: 'var(--primary)' }}
        >
          View on GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<AlertCircle className="w-4 h-4" />}
          label="Open Issues"
          value={insights.issues?.length ?? 0}
          color="#f59e0b"
        />
        <MetricCard
          icon={<GitPullRequest className="w-4 h-4" />}
          label="Open PRs"
          value={insights.prs?.length ?? 0}
          color="#8b5cf6"
        />
        <MetricCard
          icon={<Users className="w-4 h-4" />}
          label="Contributors"
          value={insights.contributors?.length ?? 0}
          color="#10b981"
        />
      </div>

      {insights.contributors?.length > 0 && (
        <div className="mt-3 flex items-center gap-1">
          <span className="text-xs mr-2" style={{ color: 'var(--text-muted)' }}>Top:</span>
          {insights.contributors.slice(0, 5).map((c, i) => (
            <img
              key={i}
              src={c.avatar_url}
              alt={c.login}
              title={c.login}
              className="w-7 h-7 rounded-full border-2 -ml-1 first:ml-0 hover:scale-110 transition-transform"
              style={{ borderColor: 'var(--bg-secondary)' }}
            />
          ))}
          {insights.contributors.length > 5 && (
            <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>+{insights.contributors.length - 5}</span>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, color }) {
  return (
    <div className="text-center p-2 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      <div className="flex items-center justify-center gap-1.5 mb-0.5" style={{ color }}>
        {icon}
      </div>
      <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

export default RepoInsights;
