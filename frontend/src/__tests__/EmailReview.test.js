import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailReview from '../components/EmailReview';
import axios from 'axios';

jest.mock('axios');

describe('EmailReview', () => {
  it('renders and sends email', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    render(<EmailReview username="octocat" score={99} />);
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Send'));
    expect(await screen.findByText(/Report sent successfully/)).toBeInTheDocument();
  });
});
