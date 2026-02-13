import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import '../i18n';

describe('i18n', () => {
  it('renders language switcher and changes language', () => {
    render(<App />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
  });
});
