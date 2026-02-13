import React from 'react';
import { Share2 } from 'lucide-react';

function ShareScore({ score, username }) {
  const text = `🏆 My GitFolioScore is ${score}/100! Check your GitHub portfolio score at GitFolioScore.`;
  const url = window.location.origin;

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${text}\n${url}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={shareTwitter}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md active:scale-95"
        style={{ background: '#1DA1F2' }}
      >
        𝕏 Share
      </button>
      <button
        onClick={shareLinkedIn}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md active:scale-95"
        style={{ background: '#0A66C2' }}
      >
        in Share
      </button>
      <button
        onClick={copyToClipboard}
        className="btn-secondary flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl"
      >
        <Share2 className="w-4 h-4" />
        Copy
      </button>
    </div>
  );
}

export default ShareScore;
