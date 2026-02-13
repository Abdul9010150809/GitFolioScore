import React, { useMemo } from 'react';
import {
  MapPin, Users, GitBranch, Calendar, Award, TrendingUp, TrendingDown, Minus,
  Mail, Link as LinkIcon, Building, ExternalLink
} from 'lucide-react';

const ScoreCard = ({ score, profile, previousScore, showDetails = true, onShare }) => {
  const scoreColor = useMemo(() => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }, [score]);



  const scoreMessage = useMemo(() => {
    if (score >= 80) return '🏆 Excellent Portfolio!';
    if (score >= 60) return '✨ Good Portfolio';
    if (score >= 40) return '📈 Needs Improvement';
    return '⚠️ Critical Attention Needed';
  }, [score]);

  const scoreTrend = useMemo(() => {
    if (!previousScore) return null;
    const diff = score - previousScore;
    if (diff > 0) return { icon: TrendingUp, color: '#10b981', text: `+${diff} points` };
    if (diff < 0) return { icon: TrendingDown, color: '#ef4444', text: `${diff} points` };
    return { icon: Minus, color: 'var(--text-muted)', text: 'No change' };
  }, [score, previousScore]);

  const getMemberSince = () => {
    if (!profile.created_at) return '';
    const date = new Date(profile.created_at);
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  };

  // SVG ring parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="premium-card overflow-hidden animate-fade-in-up">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt={`${profile.name || profile.login || 'User'}'s avatar`}
                className="w-28 h-28 rounded-2xl border-4 shadow-lg object-cover"
                style={{ borderColor: scoreColor }}
              />
              {profile.hireable && (
                <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: '#10b981' }}>
                  Hireable
                </span>
              )}
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex-shrink-0 relative">
            <svg width="140" height="140" className="-rotate-90">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ animation: 'scoreReveal 1.5s ease forwards', filter: `drop-shadow(0 0 8px ${scoreColor}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold" style={{ color: scoreColor }}>
                {score}
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {profile.name || profile.login || 'Unknown'}
              </h2>
              {profile.login && (
                <a
                  href={profile.html_url || `https://github.com/${profile.login}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  @{profile.login} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="badge badge-purple font-semibold" style={{ background: `${scoreColor}15`, color: scoreColor }}>
                {scoreMessage}
              </span>
              {scoreTrend && (
                <span className="flex items-center gap-1 text-sm font-medium" style={{ color: scoreTrend.color }}>
                  <scoreTrend.icon className="w-4 h-4" />
                  {scoreTrend.text}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </span>
              )}
              {profile.company && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> {profile.company}
                </span>
              )}
              {getMemberSince() && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Member for {getMemberSince()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      {showDetails && (
        <div className="border-t px-8 py-5 stagger-children" style={{ borderColor: 'var(--border)', background: 'var(--bg-glass)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox icon={<Users className="w-5 h-5" />} label="Followers" value={profile.followers?.toLocaleString() || '0'} color="var(--primary)" />
            <StatBox icon={<Users className="w-5 h-5" />} label="Following" value={profile.following?.toLocaleString() || '0'} color="var(--accent)" />
            <StatBox icon={<GitBranch className="w-5 h-5" />} label="Repositories" value={profile.public_repos || '0'} color="var(--info)" />
            <StatBox icon={<Award className="w-5 h-5" />} label="Score" value={`${score}/100`} color={scoreColor} />
          </div>

          {/* Contact links */}
          {(profile.email || profile.blog || profile.twitter_username) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                  <Mail className="w-4 h-4" /> {profile.email}
                </a>
              )}
              {profile.blog && (
                <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                  <LinkIcon className="w-4 h-4" /> Website
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Score legend */}
      <div className="px-8 py-3 border-t flex flex-wrap gap-5 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> 80-100: Excellent</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 60-79: Good</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> 40-59: Needs Work</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> 0-39: Critical</span>
      </div>
    </div>
  );
};

function StatBox({ icon, label, value, color }) {
  return (
    <div className="glass-card p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-1" style={{ color }}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

export default ScoreCard;