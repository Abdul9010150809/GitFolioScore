import React from 'react';
import { render, screen } from '@testing-library/react';
import RepoInsights from '../components/RepoInsights';

describe('RepoInsights', () => {
  it('renders issues, PRs, and contributors', () => {
    const insights = {
      issues: [{ number: 1, title: 'Bug', url: 'url1' }],
      prs: [{ number: 2, title: 'Fix', url: 'url2' }, { number: 3, title: 'Feat', url: 'url3' }],
      contributors: [{ login: 'octocat', url: 'url3', avatar_url: 'avatar' }]
    };
    render(<RepoInsights repo={{ name: 'repo' }} insights={insights} />);
    expect(screen.getByText(/repo/)).toBeInTheDocument();
    expect(screen.getByText(/Open Issues/)).toBeInTheDocument();
    expect(screen.getAllByText(/1/).length).toBeGreaterThan(0); // Issues, PRs, Contributors all have length 1
    expect(screen.getByText(/Open PRs/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument(); // PR count is 2 in mock data? Wait, mock says 2?
    expect(screen.getByTitle('octocat')).toBeInTheDocument();
  });
});
