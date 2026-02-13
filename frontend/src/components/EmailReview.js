import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';

function EmailReview({ username, score }) {
  const [email, setEmail] = useState('');
  const [includeReport, setIncludeReport] = useState(true);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSend = async () => {
    if (!isValidEmail(email)) return;
    setStatus('sending');
    try {
      await axios.post('/api/email/review', {
        to: email,
        username,
        score,
        includeFullReport: includeReport,
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="premium-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Email Report</h3>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Send your portfolio analysis to your inbox for reference.
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="email"
          className="premium-input flex-1 text-sm"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={handleSend}
          disabled={!isValidEmail(email) || status === 'sending'}
        >
          {status === 'sending' ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send
        </button>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeReport}
          onChange={e => setIncludeReport(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <FileText className="w-3.5 h-3.5" /> Include full report
        </span>
      </label>

      {status === 'success' && (
        <div className="mt-3 flex items-center gap-2 text-sm animate-fade-in" style={{ color: '#10b981' }}>
          <CheckCircle className="w-4 h-4" /> Report sent successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-3 flex items-center gap-2 text-sm animate-fade-in" style={{ color: '#ef4444' }}>
          <AlertCircle className="w-4 h-4" /> Failed to send. Please try again.
        </div>
      )}
    </div>
  );
}

export default EmailReview;