import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 400));
    expect(result.current).toBe('hello');
  });

  it('should not update value before delay has elapsed', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'first' },
    });

    expect(result.current).toBe('first');

    // Change input value
    rerender({ val: 'second' });

    // Advance 200ms (less than 400ms delay)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Value should still be 'first'
    expect(result.current).toBe('first');
  });

  it('should update to new value after delay has passed', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'first' },
    });

    rerender({ val: 'phone' });

    // Advance 400ms
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('phone');
  });

  it('should reset timer when value changes rapidly before debounce completes', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'p' },
    });

    // Rapid typing: "p" -> "ph" -> "pho" -> "phone"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ val: 'ph' });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ val: 'pho' });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ val: 'phone' });

    // Total 300ms has elapsed, but each keystroke reset the timer
    expect(result.current).toBe('p');

    // Now wait the full 400ms after the last keystroke
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('phone');
  });
});
