import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ScoreCard from './components/ScoreCard';
import Breakdown from './components/Breakdown';
import Insights from './components/Insights';
import TopRepos from './components/TopRepos';
import LanguageChart from './components/LanguageChart';
import RepoInsights from './components/RepoInsights';
import useAuth from './hooks/useAuth';
import useDarkMode from './hooks/useDarkMode';
import CommitActivityGraph from './components/CommitActivityGraph';
import ExportReport from './components/ExportReport';
import TrendingRepos from './components/TrendingRepos';
import ShareScore from './components/ShareScore';
import EmailReview from './components/EmailReview';
import LinkedInBadge from './components/LinkedInBadge';
import ScoreTrends from './components/ScoreTrends';
import Leaderboard from './components/Leaderboard';
import Tips from './components/Tips';
import WeightsForm from './components/WeightsForm';
import { Search, Moon, Sun, LogOut, Github } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [showWeights, setShowWeights] = useState(false);
  const [weights, setWeights] = useState({
    profile: 15,
    repoQuality: 25,
    activity: 20,
    impact: 20,
    diversity: 10,
    docs: 10
  });
  const { token, login, logout } = useAuth();
  const [dark, setDark] = useDarkMode();
  const reportRef = useRef();
  const { i18n } = useTranslation();

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const config = token ? { headers: { Authorization: `token ${token}` } } : {};
      const params = weights ? { weights: JSON.stringify(weights) } : {};
      const res = await axios.get(`/api/analyze/${username}`, { ...config, params });
      setData(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Hero Header */}
      <header
        className="relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white text-xl">⚡</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                GitFolio<span className="text-indigo-300">Score</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 bg-white/10 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
              >
                <option value="en" className="text-gray-900">EN</option>
                <option value="es" className="text-gray-900">ES</option>
              </select>

              <button
                className="p-2 rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                onClick={() => setDark(d => !d)}
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {token ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-indigo-200">
                    <b className="text-white">{login}</b>
                  </span>
                  <button
                    className="p-2 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-red-500/20 transition-all"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <a
                  href="/auth/github/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <Github className="w-4 h-4" />
                  Sign in
                </a>
              )}
            </div>
          </div>

          {/* Hero content */}
          <div className="text-center py-8 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Your GitHub Portfolio,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Scored by Recruiters
              </span>
            </h2>
            <p className="text-indigo-200/80 text-lg max-w-2xl mx-auto mb-10">
              Get an objective analysis of your GitHub presence with scoring, strengths,
              red flags, and improvement suggestions — just like real hiring teams evaluate portfolios.
            </p>

            {/* Search bar */}
            <div className="flex items-center justify-center gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300" />
                <input
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-indigo-300/60 bg-white/10 border border-white/20 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-base"
                  type="text"
                  placeholder="Enter GitHub username..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              <button
                className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                style={{ background: 'var(--gradient-primary)' }}
                onClick={handleAnalyze}
                disabled={loading || !username.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : 'Analyze'}
              </button>
            </div>

            {/* Custom weights toggle */}
            <button
              className="mt-4 text-indigo-300/70 text-sm hover:text-indigo-200 transition-colors"
              onClick={() => setShowWeights(w => !w)}
            >
              {showWeights ? '▲ Hide custom weights' : '▼ Customize scoring weights'}
            </button>

            {showWeights && (
              <div className="mt-4 animate-fade-in">
                <WeightsForm weights={weights} setWeights={setWeights} dark={true} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error display */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-6 animate-fade-in-up">
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl border" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <span className="text-red-500 text-xl">⚠️</span>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && !data && (
        <div className="max-w-4xl mx-auto px-4 mt-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full" style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
            <svg className="animate-spin h-5 w-5" style={{ color: 'var(--primary)' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span style={{ color: 'var(--text-secondary)' }}>Analyzing GitHub profile...</span>
          </div>
        </div>
      )}

      {/* Results section */}
      {data && (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
          {/* Actions bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ExportReport targetRef={reportRef} />
            <ShareScore score={data.score} username={username} />
          </div>

          <div ref={reportRef} className="space-y-8">
            {/* Score Card */}
            <ScoreCard score={data.score} profile={data.profile} />

            {/* Score Breakdown */}
            <Breakdown breakdown={data.scoreBreakdown} />

            {/* Commit Activity */}
            <CommitActivityGraph commitActivity={data.commitActivity} />

            {/* Insights Section */}
            <Insights strengths={data.strengths} redFlags={data.redFlags} suggestions={data.suggestions} />

            {/* Repo Insights for top repos */}
            {data.topRepos && data.topRepos.length > 0 && data.repoInsights && (
              <div className="space-y-4">
                {data.topRepos.map(repo => (
                  <RepoInsights key={repo.name} repo={repo} insights={data.repoInsights[repo.name]} />
                ))}
              </div>
            )}

            {/* Two column layout */}
            <div className="grid md:grid-cols-2 gap-6">
              <TopRepos repos={data.topRepos} username={username} />
              <LanguageChart languages={data.mostUsedLanguages} />
            </div>
          </div>

          {/* Email & Share panels */}
          <div className="grid md:grid-cols-2 gap-6">
            <EmailReview username={username} score={data.score} />
            <LinkedInBadge username={username} score={data.score} />
          </div>

          {/* Score trends */}
          <ScoreTrends username={username} />
        </div>
      )}

      {/* Below-the-fold content (shown when no results) */}
      {!data && !loading && (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <Leaderboard />
            <TrendingRepos />
          </div>
          <Tips />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Built with ❤️ for the Hackathon — <span className="gradient-text font-semibold">GitFolioScore</span> analyzes GitHub portfolios like real recruiters do.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
