import { useState, useEffect, useCallback, useRef } from 'react';

// ===== DEBOUNCE HOOK =====
export function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ===== INFINITE SCROLL HOOK =====
export function useInfiniteScroll(
  callback: () => void,
  dependencies: [boolean, boolean]
) {
  const observerRef = useRef<HTMLDivElement>(null);
  const [hasNextPage, isFetchingNextPage] = dependencies;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      callback();
    }
  }, [callback, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return observerRef;
}