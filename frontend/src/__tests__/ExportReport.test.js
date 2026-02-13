import React from 'react';
import { render, screen } from '@testing-library/react';
import ExportReport from '../components/ExportReport';

describe('ExportReport', () => {
  it('renders export buttons', () => {
    const ref = { current: document.createElement('div') };
    render(<ExportReport targetRef={ref} />);
    expect(screen.getByText('Export PNG')).toBeInTheDocument();
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
  });
});
