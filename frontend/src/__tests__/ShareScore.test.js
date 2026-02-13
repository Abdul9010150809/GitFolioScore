import React from 'react';
import { render, screen } from '@testing-library/react';
import ShareScore from '../components/ShareScore';

describe('ShareScore', () => {
  it('renders share buttons', () => {
    render(<ShareScore score={88} username="octocat" />);
    expect(screen.getByText('𝕏 Share')).toBeInTheDocument();
    expect(screen.getByText('in Share')).toBeInTheDocument();
    expect(screen.getByText(/Copy/)).toBeInTheDocument();
  });
});
