import React from 'react';
import { render, screen } from '@testing-library/react';
import Tips from '../components/Tips';

describe('Tips', () => {
  it('renders all tips', () => {
    render(<Tips />);
    expect(screen.getByText(/Add a profile README/)).toBeInTheDocument();
    expect(screen.getByText(/Diversify your tech stack/)).toBeInTheDocument();
    expect(screen.getByText(/Add license and CI\/CD/)).toBeInTheDocument();
  });
});
