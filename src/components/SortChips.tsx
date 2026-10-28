import React from 'react';
import { SortField, SortOrder } from '../types/product';
import { tokens } from '../theme/tokens';
import { ArrowDownUp } from 'lucide-react';

interface SortChipsProps {
  currentSortField: SortField | undefined;
  currentSortOrder: SortOrder;
  onSelectSortField: (field: SortField) => void;
  onSelectSortOrder: (order: SortOrder) => void;
}

export const SortChips: React.FC<SortChipsProps> = ({
  currentSortField,
  currentSortOrder,
  onSelectSortField,
  onSelectSortOrder,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar">
      {/* Price Sort Chip */}
      <button
        type="button"
        onClick={() => onSelectSortField('price')}
        className="flex items-center justify-center px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs"
        style={{
          borderRadius: tokens.radius.chip,
          minHeight: 38,
          backgroundColor:
            currentSortField === 'price'
              ? tokens.colors.chipActiveBackground
              : tokens.colors.chipInactiveBackground,
          color:
            currentSortField === 'price'
              ? tokens.colors.chipActiveText
              : tokens.colors.chipInactiveText,
          border: `1px solid ${
            currentSortField === 'price' ? tokens.colors.primary : tokens.colors.border
          }`,
        }}
      >
        Price
      </button>

      {/* Rating Sort Chip */}
      <button
        type="button"
        onClick={() => onSelectSortField('rating')}
        className="flex items-center justify-center px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs"
        style={{
          borderRadius: tokens.radius.chip,
          minHeight: 38,
          backgroundColor:
            currentSortField === 'rating'
              ? tokens.colors.chipActiveBackground
              : tokens.colors.chipInactiveBackground,
          color:
            currentSortField === 'rating'
              ? tokens.colors.chipActiveText
              : tokens.colors.chipInactiveText,
          border: `1px solid ${
            currentSortField === 'rating' ? tokens.colors.primary : tokens.colors.border
          }`,
        }}
      >
        Rating
      </button>

      <div
        className="h-5 w-px mx-0.5 shrink-0"
        style={{ backgroundColor: tokens.colors.border }}
      />

      {/* Low-High Chip */}
      <button
        type="button"
        onClick={() => onSelectSortOrder('asc')}
        className="flex items-center justify-center px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs"
        style={{
          borderRadius: tokens.radius.chip,
          minHeight: 38,
          backgroundColor:
            currentSortOrder === 'asc'
              ? tokens.colors.chipActiveBackground
              : tokens.colors.chipInactiveBackground,
          color:
            currentSortOrder === 'asc'
              ? tokens.colors.chipActiveText
              : tokens.colors.chipInactiveText,
          border: `1px solid ${
            currentSortOrder === 'asc' ? tokens.colors.primary : tokens.colors.border
          }`,
        }}
      >
        Low-High
      </button>

      {/* High-Low Chip */}
      <button
        type="button"
        onClick={() => onSelectSortOrder('desc')}
        className="flex items-center justify-center px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs"
        style={{
          borderRadius: tokens.radius.chip,
          minHeight: 38,
          backgroundColor:
            currentSortOrder === 'desc'
              ? tokens.colors.chipActiveBackground
              : tokens.colors.chipInactiveBackground,
          color:
            currentSortOrder === 'desc'
              ? tokens.colors.chipActiveText
              : tokens.colors.chipInactiveText,
          border: `1px solid ${
            currentSortOrder === 'desc' ? tokens.colors.primary : tokens.colors.border
          }`,
        }}
      >
        High-Low
      </button>
    </div>
  );
};
