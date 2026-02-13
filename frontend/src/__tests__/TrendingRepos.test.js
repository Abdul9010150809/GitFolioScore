import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TrendingRepos from '../components/TrendingRepos';
import axios from 'axios';

jest.mock('axios');

describe('TrendingRepos', () => {
  it('renders trending repos', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { name: 'repo1', description: 'desc', stars: 10, url: 'url', language: 'JS' }
      ]
    });
    render(<TrendingRepos />);
    await waitFor(() => expect(screen.getByText('repo1')).toBeInTheDocument());
  });
  it('shows error on failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('fail'));
    render(<TrendingRepos />);
    await waitFor(() => expect(screen.getByText(/Unable to load/)).toBeInTheDocument());
  });
});
