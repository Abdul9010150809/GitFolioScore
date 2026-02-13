import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const tipsList = [
  {
    title: 'Write descriptive READMEs',
    detail: 'Include project purpose, setup instructions, screenshots, and tech stack. Recruiters spend about 30 seconds scanning your repo.',
    icon: '📝',
    category: 'Documentation',
  },
  {
    title: 'Commit frequently and meaningfully',
    detail: 'Use conventional commits (feat:, fix:, docs:) and avoid "initial commit" or "update" messages. Show consistent daily/weekly activity.',
    icon: '⚡',
    category: 'Activity',
  },
  {
    title: 'Pin your best 6 repositories',
    detail: 'Curate your profile by pinning projects that showcase diverse skills. Include at least one full-stack, one open-source contribution, and one personal project.',
    icon: '📌',
    category: 'Profile',
  },
  {
    title: 'Add topics and descriptions',
    detail: 'Tag repos with relevant topics (react, python, api) and write clear one-line descriptions. This helps with discoverability and shows organization.',
    icon: '🏷️',
    category: 'Organization',
  },
  {
    title: 'Contribute to open source',
    detail: 'Even small PRs to popular repos show collaboration skills. Start with documentation fixes, then work up to code contributions.',
    icon: '🌍',
    category: 'Impact',
  },
  {
    title: 'Add a profile README',
    detail: 'Create a username/username repo with a README.md for your profile page. Include a brief intro, tech stack, and stats widgets.',
    icon: '👤',
    category: 'Profile',
  },
  {
    title: 'Diversify your tech stack',
    detail: 'Show proficiency in multiple languages and frameworks. Include both frontend and backend projects, plus devops or data science if applicable.',
    icon: '🎨',
    category: 'Diversity',
  },
  {
    title: 'Add license and CI/CD',
    detail: 'MIT or Apache-2.0 licenses show professionalism. GitHub Actions workflows demonstrate DevOps awareness that recruiters value.',
    icon: '⚙️',
    category: 'Quality',
  },
];

function Tips() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleTip = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="premium-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5" style={{ color: '#f59e0b' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Score Improvement Tips
        </h3>
      </div>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
        Actionable advice from recruiters to boost your GitHub portfolio score
      </p>

      <div className="space-y-2 stagger-children">
        {tipsList.map((tip, i) => {
          const isOpen = expandedIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border transition-all cursor-pointer"
              style={{
                borderColor: isOpen ? 'var(--primary)' : 'var(--border)',
                background: isOpen ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
              }}
              onClick={() => toggleTip(i)}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">{tip.icon}</span>
                <div className="flex-1">
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {tip.title}
                  </span>
                  <span className="badge badge-info text-[10px] ml-2">{tip.category}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              {isOpen && (
                <div className="px-4 pb-3 animate-fade-in">
                  <p className="text-sm leading-relaxed pl-9" style={{ color: 'var(--text-secondary)' }}>
                    {tip.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tips;
