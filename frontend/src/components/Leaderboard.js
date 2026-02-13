import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Crown } from 'lucide-react';

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', icon: Crown, shadow: '0 4px 15px rgba(245, 158, 11, 0.3)' },
  { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: Medal, shadow: '0 4px 15px rgba(148, 163, 184, 0.3)' },
  { bg: 'linear-gradient(135deg, #cd7f32, #a0522d)', icon: Medal, shadow: '0 4px 15px rgba(205, 127, 50, 0.3)' },
];

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/leaderboard')
      .then(r => setLeaders(r.data))
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="premium-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Leaderboard</h3>
        <span className="badge badge-warning ml-auto">Benchmark</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer h-14 rounded-xl" />
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No data available</p>
      ) : (
        <div className="space-y-2 stagger-children">
          {leaders.map((user, i) => {
            const isTopThree = i < 3;
            const rankStyle = RANK_STYLES[i] || null;

            return (
              <div
                key={user.username}
                className="glass-card flex items-center gap-3 p-3 group"
                style={isTopThree ? { border: `1px solid ${i === 0 ? '#fbbf2440' : i === 1 ? '#94a3b840' : '#cd7f3240'}` } : {}}
              >
                {/* Rank */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={
                    rankStyle
                      ? { background: rankStyle.bg, color: 'white', boxShadow: rankStyle.shadow }
                      : { background: 'var(--border)', color: 'var(--text-secondary)' }
                  }
                >
                  {i + 1}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <a
                    href={`https://github.com/${user.username}`}
                    target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-sm hover:underline truncate block"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {user.badge} {user.username}
                  </a>
                  {user.category && (
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {user.category}
                    </span>
                  )}
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold" style={{ color: user.score >= 90 ? '#10b981' : user.score >= 70 ? '#3b82f6' : '#f59e0b' }}>
                    {user.score}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
