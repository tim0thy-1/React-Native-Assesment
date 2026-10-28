import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value by a specified delay (default 400ms).
 * Cancels pending timers on every new change.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
