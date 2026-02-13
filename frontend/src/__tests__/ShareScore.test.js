import React from 'react';
import { render, screen } from '@testing-library/react';
import ShareScore from '../components/ShareScore';

describe('ShareScore', () => {
  it('renders share buttons', () => {
    render(<ShareScore score={88} username="octocat" />);
    expect(screen.getByText('Share on Twitter')).toBeInTheDocument();
    expect(screen.getByText('Share on LinkedIn')).toBeInTheDocument();
  });
});
