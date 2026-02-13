import React from 'react';
import { render, screen } from '@testing-library/react';
import Tips from '../components/Tips';

describe('Tips', () => {
  it('renders all tips', () => {
    render(<Tips />);
    expect(screen.getByText(/Complete Your Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Write Good READMEs/)).toBeInTheDocument();
    expect(screen.getByText(/Engage with the Community/)).toBeInTheDocument();
  });
});
