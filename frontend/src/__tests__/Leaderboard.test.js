import React from 'react';
import { render, screen } from '@testing-library/react';
import Leaderboard from '../components/Leaderboard';
import axios from 'axios';

jest.mock('axios');

describe('Leaderboard', () => {
  it('renders leaderboard users', async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { username: 'octocat', score: 95 },
      { username: 'vercel', score: 90 }
    ] });
    render(<Leaderboard />);
    expect(await screen.findByText('octocat')).toBeInTheDocument();
    expect(await screen.findByText('vercel')).toBeInTheDocument();
    expect(await screen.findByText('95')).toBeInTheDocument();
  });
});
