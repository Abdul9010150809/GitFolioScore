import { renderHook, act } from '@testing-library/react';
import useDarkMode from '../hooks/useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should default to false if not set', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
  });

  it('should toggle dark mode and update class', () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => {
      result.current[1](true);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('dark_mode')).toBe('true');
    act(() => {
      result.current[1](false);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('dark_mode')).toBe('false');
  });
});
