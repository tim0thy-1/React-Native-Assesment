import React from 'react';
import { Search, X } from 'lucide-react';
import { tokens } from '../theme/tokens';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search products...',
}) => {
  return (
    <div className="relative w-full flex items-center">
      {/* Search Icon */}
      <div
        className="absolute left-3 flex items-center justify-center pointer-events-none"
        style={{ color: tokens.colors.mutedText }}
      >
        <Search size={18} color={tokens.colors.mutedText} />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-11 py-2.5 text-sm transition-colors outline-none"
        style={{
          backgroundColor: tokens.colors.white,
          color: tokens.colors.text,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.chip,
          height: 44,
          fontSize: tokens.typography.body.fontSize,
        }}
        aria-label="Search products"
      />

      {/* Clear Button (only shown when text entered) */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-1 flex items-center justify-center transition-opacity hover:opacity-75 cursor-pointer"
          style={{
            minWidth: tokens.touchTarget.minWidth,
            minHeight: tokens.touchTarget.minHeight,
            color: tokens.colors.mutedText,
          }}
          aria-label="Clear search text"
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: tokens.colors.border }}
          >
            <X size={12} color={tokens.colors.mutedText} />
          </div>
        </button>
      )}
    </div>
  );
};
