import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import WeightsForm from '../components/WeightsForm';

describe('WeightsForm', () => {
  it('renders all weight fields and updates values', () => {
    const initialWeights = {
      profile: 15,
      repoQuality: 25,
      activity: 20,
      impact: 20,
      diversity: 10,
      docs: 10
    };
    const setWeights = jest.fn();
    render(<WeightsForm weights={initialWeights} setWeights={setWeights} />);
    
    // Check that the component renders by checking for labels using exact text
    expect(screen.getByLabelText('profile')).toBeInTheDocument();
    expect(screen.getByLabelText('repoQuality')).toBeInTheDocument();
    expect(screen.getByLabelText('activity')).toBeInTheDocument();
    expect(screen.getByLabelText('impact')).toBeInTheDocument();
    expect(screen.getByLabelText('diversity')).toBeInTheDocument();
    expect(screen.getByLabelText('docs')).toBeInTheDocument();
    
    // Simulate change on profile field
    const input = screen.getByLabelText('profile');
    fireEvent.change(input, { target: { value: '30' } });
    expect(setWeights).toHaveBeenCalled();
  });
});
