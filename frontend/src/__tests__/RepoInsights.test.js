import React from 'react';
import { render, screen } from '@testing-library/react';
import RepoInsights from '../components/RepoInsights';

describe('RepoInsights', () => {
  it('renders issues, PRs, and contributors', () => {
    const insights = {
      issues: [{ number: 1, title: 'Bug', url: 'url1' }],
      prs: [{ number: 2, title: 'Fix', url: 'url2' }],
      contributors: [{ login: 'octocat', url: 'url3', avatar_url: 'avatar' }]
    };
    render(<RepoInsights repo={{ name: 'repo' }} insights={insights} />);
    expect(screen.getByText(/Details for repo/)).toBeInTheDocument();
    expect(screen.getByText(/Bug/)).toBeInTheDocument();
    expect(screen.getByText(/Fix/)).toBeInTheDocument();
    expect(screen.getByTitle('octocat')).toBeInTheDocument();
  });
});
