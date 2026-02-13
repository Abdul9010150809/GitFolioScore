import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-2 text-sm" style={{ backdropFilter: 'blur(12px)' }}>
      <p style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="font-bold" style={{ color: 'var(--primary)' }}>Score: {payload[0].value}</p>
    </div>
  );
};

function ScoreTrends({ username }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    axios
      .get(`/api/score-history/${username}`)
      .then(r => setHistory(r.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [username]);

  if (!username) return null;

  return (
    <div className="premium-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Score History</h3>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Track how your portfolio score changes over time
      </p>

      {loading ? (
        <div className="shimmer h-48 rounded-xl" />
      ) : history.length === 0 ? (
        <p className="text-sm italic text-center py-8" style={{ color: 'var(--text-muted)' }}>
          No historical data available yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={history}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ScoreTrends;
