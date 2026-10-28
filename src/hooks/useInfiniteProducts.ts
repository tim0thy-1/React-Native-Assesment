import { useState, useEffect, useRef, useCallback } from 'react';
import { Product, SortField, SortOrder } from '../types/product';
import { fetchProducts } from '../services/api';
import { useNetworkStatus } from './useNetworkStatus';

const PAGE_SIZE = 20;

export interface UseInfiniteProductsProps {
  searchQuery: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export function useInfiniteProducts({
  searchQuery,
  sortBy,
  order = 'asc',
}: UseInfiniteProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { isOnline } = useNetworkStatus();

  // Reference to abort controller for current in-flight request
  const abortControllerRef = useRef<AbortController | null>(null);

  // Guard flags to prevent duplicate simultaneous page requests
  const isFetchingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);
  const currentSkipRef = useRef<number>(0);

  // Track previous online status to trigger automatic retry when connection comes back
  const wasOfflineRef = useRef<boolean>(!isOnline);

  const hasMore = products.length < total;
  hasMoreRef.current = hasMore;

  /**
   * Core fetch handler
   */
  const executeFetch = useCallback(
    async (skip: number, isRefresh = false) => {
      // Guard against duplicate page requests when already fetching
      if (isFetchingRef.current) {
        return;
      }

      // If fetching next page (skip > 0) but no more items, stop
      if (skip > 0 && !hasMoreRef.current) {
        return;
      }

      // Cancel previous outdated request with AbortController
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      isFetchingRef.current = true;

      if (skip === 0) {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const response = await fetchProducts({
          limit: PAGE_SIZE,
          skip,
          searchQuery,
          sortBy,
          order,
          signal: controller.signal,
        });

        // If request was aborted in the meantime, ignore
        if (controller.signal.aborted) {
          return;
        }

        setTotal(response.total);
        currentSkipRef.current = skip + response.products.length;
        hasMoreRef.current = (skip + response.products.length) < response.total;

        setProducts((prev) => {
          if (skip === 0) {
            return response.products;
          }
          // Deduplicate items by id so we never render duplicate items
          const existingIds = new Set(prev.map((p) => p.id));
          const newUnique = response.products.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newUnique];
        });
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Normal cancellation, don't set error
          return;
        }
        console.error('Fetch products error:', err);
        setError(err.message || 'Failed to load products. Please check your network.');
      } finally {
        if (abortControllerRef.current === controller) {
          isFetchingRef.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
          setIsRefreshing(false);
        }
      }
    },
    [searchQuery, sortBy, order]
  );

  /**
   * Reset and fetch page 1 whenever search query, sortBy, or order changes
   */
  useEffect(() => {
    currentSkipRef.current = 0;
    hasMoreRef.current = true;
    executeFetch(0, false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [executeFetch]);

  /**
   * Automatically retry when the connection comes back
   */
  useEffect(() => {
    if (wasOfflineRef.current && isOnline) {
      // Just reconnected! Automatically reload data
      wasOfflineRef.current = false;
      executeFetch(0, true);
    } else if (!isOnline) {
      wasOfflineRef.current = true;
    }
  }, [isOnline, executeFetch]);

  /**
   * Infinite scroll: load next 20 items
   */
  const loadMore = useCallback(() => {
    if (isFetchingRef.current || isLoading || isLoadingMore || !hasMoreRef.current) {
      return;
    }
    executeFetch(currentSkipRef.current, false);
  }, [executeFetch, isLoading, isLoadingMore]);

  /**
   * Pull down / Pull to refresh: refresh from page 1
   */
  const refresh = useCallback(async () => {
    currentSkipRef.current = 0;
    hasMoreRef.current = true;
    await executeFetch(0, true);
  }, [executeFetch]);

  /**
   * Retry action for error state
   */
  const retry = useCallback(() => {
    executeFetch(currentSkipRef.current === 0 ? 0 : currentSkipRef.current, false);
  }, [executeFetch]);

  return {
    products,
    total,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    retry,
  };
}
