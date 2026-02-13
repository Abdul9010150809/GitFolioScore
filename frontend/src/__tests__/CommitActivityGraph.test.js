import React from 'react';
import { render, screen } from '@testing-library/react';
import CommitActivityGraph from '../components/CommitActivityGraph';

// Mock recharts to avoid canvas rendering issues
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  AreaChart: () => <div data-testid="area-chart" />,
  Line: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => <div data-testid="legend">Legend</div>,
}));

describe('CommitActivityGraph', () => {
  it('renders nothing if no data', () => {
    render(<CommitActivityGraph commitActivity={{}} />);
    expect(screen.queryByText(/Commit Activity/)).toBeNull();
  });
  it('renders graph with data', () => {
    const commitActivity = {
      repo1: Array.from({ length: 52 }, (_, i) => ({ total: i, week: 1000000 + i * 604800 })),
      repo2: Array.from({ length: 52 }, (_, i) => ({ total: 2 * i, week: 1000000 + i * 604800 })),
    };
    render(<CommitActivityGraph commitActivity={commitActivity} />);
    expect(screen.getByText(/Commit Activity/)).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
