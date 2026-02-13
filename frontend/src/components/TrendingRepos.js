import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Star, ExternalLink } from 'lucide-react';

function TrendingRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/trending')
      .then(r => setRepos(r.data.slice(0, 6)))
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="premium-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5" style={{ color: '#10b981' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Trending Now</h3>
        <span className="badge badge-success ml-auto">🔥 Hot</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-xl" />
          ))}
        </div>
      ) : repos.length === 0 ? (
        <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>Unable to load trending repos</p>
      ) : (
        <div className="space-y-2 stagger-children">
          {repos.map((repo, i) => (
            <a
              key={repo.full_name || i}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-3 flex items-start gap-3 hover:border-green-500/40 group block"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm truncate group-hover:text-green-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {repo.full_name || repo.name}
                  </span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--success)' }} />
                </div>
                {repo.description && (
                  <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" style={{ color: '#f59e0b' }} />
                    {(repo.stargazers_count || 0).toLocaleString()}
                  </span>
                  {repo.language && (
                    <span className="badge badge-purple text-[10px]">{repo.language}</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingRepos;
