import React from 'react';
import { Sliders } from 'lucide-react';

const weightMeta = {
  profile: { label: 'Profile', icon: '👤', max: 30 },
  repoQuality: { label: 'Repo Quality', icon: '📦', max: 50 },
  activity: { label: 'Activity', icon: '⚡', max: 40 },
  impact: { label: 'Impact', icon: '🌟', max: 40 },
  diversity: { label: 'Diversity', icon: '🎨', max: 20 },
  docs: { label: 'Documentation', icon: '📝', max: 20 },
};

function WeightsForm({ weights, setWeights, dark }) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const isBalanced = total === 100;

  return (
    <div
      className="max-w-lg mx-auto rounded-2xl border p-5"
      style={{
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        borderColor: dark ? 'rgba(255,255,255,0.1)' : 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-4 h-4" style={{ color: dark ? '#a5b4fc' : 'var(--primary)' }} />
        <span className="font-semibold text-sm" style={{ color: dark ? '#e2e8f0' : 'var(--text-primary)' }}>
          Custom Weights
        </span>
        <span
          className={`ml-auto badge text-xs ${isBalanced ? 'badge-success' : 'badge-warning'}`}
        >
          {total}/100 {isBalanced ? '✓' : '⚠'}
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(weights).map(([key, val]) => {
          const meta = weightMeta[key] || { label: key, icon: '📊', max: 50 };
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: dark ? '#cbd5e1' : 'var(--text-secondary)' }}>
                  {meta.icon} {meta.label}
                </label>
                <span className="text-xs font-bold" style={{ color: dark ? '#a5b4fc' : 'var(--primary)' }}>
                  {val}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={meta.max}
                value={val}
                onChange={e => setWeights(w => ({ ...w, [key]: parseInt(e.target.value) }))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${dark ? '#818cf8' : '#6366f1'} ${(val / meta.max) * 100}%, ${dark ? '#334155' : '#e2e8f0'} ${(val / meta.max) * 100}%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeightsForm;
