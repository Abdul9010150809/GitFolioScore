import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreTrends from '../components/ScoreTrends';
import axios from 'axios';

jest.mock('axios');
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('ScoreTrends', () => {
  it('renders score history chart', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { date: '2026-02-01', score: 80 },
        { date: '2026-02-10', score: 90 }
      ]
    });
    render(<ScoreTrends username="octocat" />);
    expect(await screen.findByText(/Score History/)).toBeInTheDocument();
  });
});
