import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Product, SortField, SortOrder } from '../types/product';
import { tokens } from '../theme/tokens';
import { SearchBar } from '../components/SearchBar';
import { SortChips } from '../components/SortChips';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useFavorites } from '../context/FavoritesContext';
import { SearchX, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectProduct }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Debounce search input by 400ms per requirement
  const debouncedSearch = useDebounce(searchInput, 400);

  const {
    products,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    retry,
  } = useInfiniteProducts({
    searchQuery: debouncedSearch,
    sortBy: sortField,
    order: sortOrder,
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  // Scroll container ref for infinite scroll detection
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pull-to-refresh touch tracking
  const touchStartY = useRef<number>(0);
  const [pullDistance, setPullDistance] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current > 0 && scrollContainerRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - touchStartY.current);
      if (distance > 0 && distance < 120) {
        setPullDistance(distance);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      refresh();
    }
    setPullDistance(0);
    touchStartY.current = 0;
  };

  // Scroll listener to trigger loadMore when near the bottom
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    // When within 250px of the bottom, trigger next page
    if (scrollHeight - scrollTop - clientHeight < 250) {
      loadMore();
    }
  }, [loadMore]);

  const handleSortFieldChange = (field: SortField) => {
    if (sortField === field) {
      // Toggle off or keep
      setSortField(field);
    } else {
      setSortField(field);
    }
  };

  const handleSortOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 overflow-y-auto flex flex-col relative overscroll-contain"
      style={{
        backgroundColor: tokens.colors.background,
      }}
    >
      {/* Pull-down indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="w-full flex items-center justify-center transition-all py-2 text-xs font-medium"
          style={{
            color: tokens.colors.mutedText,
            height: Math.max(36, pullDistance * 0.6),
          }}
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${isRefreshing || pullDistance > 50 ? 'animate-spin' : ''}`}
            color={tokens.colors.primary}
          />
          <span>{isRefreshing ? 'Refreshing products...' : pullDistance > 50 ? 'Release to refresh' : 'Pull down to refresh'}</span>
        </div>
      )}

      {/* Header section: Title, Search, Sort chips */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1
            className="tracking-tight"
            style={{
              fontSize: tokens.typography.title.fontSize,
              fontWeight: tokens.typography.title.fontWeight,
              lineHeight: tokens.typography.title.lineHeight,
              color: tokens.colors.text,
            }}
          >
            ShopLite
          </h1>
          <button
            type="button"
            onClick={refresh}
            className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
            style={{ color: tokens.colors.mutedText }}
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw size={15} color={tokens.colors.mutedText} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search bar */}
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search products..."
        />

        {/* Sort chips */}
        <SortChips
          currentSortField={sortField}
          currentSortOrder={sortOrder}
          onSelectSortField={handleSortFieldChange}
          onSelectSortOrder={handleSortOrderChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="px-4 pb-6 flex-1 flex flex-col">
        {/* Skeleton loading state on initial load */}
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          /* Error state with Retry button */
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${tokens.colors.danger}15` }}
            >
              <AlertCircle size={28} color={tokens.colors.danger} />
            </div>
            <h3
              className="font-semibold text-base mb-1"
              style={{ color: tokens.colors.text }}
            >
              Something went wrong
            </h3>
            <p
              className="text-xs mb-4 max-w-xs"
              style={{ color: tokens.colors.mutedText }}
            >
              {error}
            </p>
            <button
              type="button"
              onClick={retry}
              className="px-6 py-2.5 font-semibold text-sm transition-transform active:scale-95 shadow-xs cursor-pointer"
              style={{
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                borderRadius: tokens.radius.button,
                minHeight: tokens.touchTarget.minHeight,
              }}
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty search state: centered icon with "No products found for '<query>'" */
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${tokens.colors.mutedText}15` }}
            >
              <SearchX size={28} color={tokens.colors.mutedText} />
            </div>
            <h3
              className="font-semibold text-base mb-1"
              style={{ color: tokens.colors.text }}
            >
              No products found
            </h3>
            <p
              className="text-xs max-w-xs"
              style={{ color: tokens.colors.mutedText }}
            >
              {debouncedSearch
                ? `No products found for '${debouncedSearch}'`
                : 'There are currently no products available.'}
            </p>
            {debouncedSearch && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="mt-4 px-4 py-2 text-xs font-semibold underline cursor-pointer"
                style={{ color: tokens.colors.primary }}
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          /* 2-column Product Grid */
          <>
            <div className="grid grid-cols-2 gap-3.5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>

            {/* Bottom Spinner when loading more items */}
            {isLoadingMore && (
              <div className="w-full flex items-center justify-center py-5">
                <Loader2
                  size={22}
                  className="animate-spin"
                  color={tokens.colors.primary}
                />
              </div>
            )}

            {/* End of list reached */}
            {!hasMore && products.length > 0 && (
              <div className="w-full text-center py-4 text-xs font-medium" style={{ color: tokens.colors.mutedText }}>
                Showing all {products.length} products
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
