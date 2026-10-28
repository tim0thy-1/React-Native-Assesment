import React from 'react';
import { Product } from '../types/product';
import { tokens } from '../theme/tokens';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, Trash2 } from 'lucide-react';

interface FavoritesScreenProps {
  onSelectProduct: (product: Product) => void;
  onBrowseProducts: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onSelectProduct,
  onBrowseProducts,
}) => {
  const { sections, favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none"
        style={{ backgroundColor: tokens.colors.background }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${tokens.colors.primary}15` }}
        >
          <Heart size={32} color={tokens.colors.primary} />
        </div>
        <h2
          className="font-semibold text-lg mb-1"
          style={{ color: tokens.colors.text }}
        >
          No favorites yet
        </h2>
        <p
          className="text-xs mb-6 max-w-xs"
          style={{ color: tokens.colors.mutedText }}
        >
          Tap the heart on any product to save it here for later.
        </p>
        <button
          type="button"
          onClick={onBrowseProducts}
          className="px-6 py-3 font-semibold text-sm transition-transform active:scale-95 shadow-sm cursor-pointer"
          style={{
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
            borderRadius: tokens.radius.button,
            minHeight: tokens.touchTarget.minHeight,
          }}
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto select-none"
      style={{
        backgroundColor: tokens.colors.background,
      }}
    >
      {/* Title */}
      <div className="px-4 pt-4 pb-2">
        <h1
          style={{
            fontSize: tokens.typography.title.fontSize,
            fontWeight: tokens.typography.title.fontWeight,
            lineHeight: tokens.typography.title.lineHeight,
            color: tokens.colors.text,
          }}
        >
          Favorites
        </h1>
      </div>

      {/* SectionList format grouped by category */}
      <div className="flex-1 px-4 pb-24">
        {sections.map((section) => (
          <div key={section.category} className="mb-5">
            {/* Category Section Header in small uppercase muted text with item count */}
            <div
              className="py-2 text-xs font-bold tracking-wider uppercase sticky top-0 backdrop-blur-xs z-10"
              style={{
                color: tokens.colors.mutedText,
              }}
            >
              {section.title} ({section.data.length})
            </div>

            {/* Rows */}
            <div
              className="flex flex-col overflow-hidden divide-y"
              style={{
                backgroundColor: tokens.colors.cardBackground,
                borderRadius: tokens.radius.card,
                borderColor: tokens.colors.border,
                border: `1px solid ${tokens.colors.border}`,
              }}
            >
              {section.data.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="flex items-center justify-between p-3.5 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors cursor-pointer"
                  style={{ borderColor: tokens.colors.border }}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.title}
                      className="w-14 h-14 object-cover shrink-0 rounded-md bg-neutral-100"
                      style={{
                        borderRadius: tokens.radius.thumbnail,
                        border: `1px solid ${tokens.colors.border}`,
                      }}
                    />
                    <div className="min-w-0 flex-1 pr-2">
                      <h3
                        className="text-sm font-semibold truncate"
                        style={{ color: tokens.colors.text }}
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                      <p
                        className="text-sm font-bold mt-0.5"
                        style={{ color: tokens.colors.primary }}
                      >
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Red Remove action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(product.id);
                    }}
                    className="flex items-center justify-center px-2 py-1 text-xs font-semibold hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                    style={{
                      color: tokens.colors.danger,
                      minHeight: tokens.touchTarget.minHeight,
                      minWidth: tokens.touchTarget.minWidth,
                    }}
                    aria-label={`Remove ${product.title} from favorites`}
                  >
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
