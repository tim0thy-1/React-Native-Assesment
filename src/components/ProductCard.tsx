import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types/product';
import { tokens } from '../theme/tokens';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard = React.memo<ProductCardProps>(({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
}) => {
  // Calculate original price if discount exists
  const discount = product.discountPercentage || 0;
  const originalPrice = discount > 0 ? product.price / (1 - discount / 100) : product.price;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelectProduct(product);
        }
      }}
      className="flex flex-col overflow-hidden text-left cursor-pointer transition-transform active:scale-[0.98] select-none shadow-xs group"
      style={{
        backgroundColor: tokens.colors.cardBackground,
        borderRadius: tokens.radius.card,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      {/* Square Image container with overlaid Heart Button */}
      <div className="relative w-full aspect-square bg-[#F3F4F6] overflow-hidden">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Heart toggle button at top-right of image */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xs transition-transform active:scale-90 hover:bg-white shadow-sm cursor-pointer z-10"
          style={{
            minWidth: 36,
            minHeight: 36,
            width: 36,
            height: 36,
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={18}
            fill={isFavorite ? tokens.colors.danger : 'none'}
            color={isFavorite ? tokens.colors.danger : tokens.colors.mutedText}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Content details */}
      <div className="p-3 flex flex-col justify-between flex-1">
        {/* Title (max 2 lines) */}
        <h3
          className="font-semibold text-sm line-clamp-2 min-h-[40px] leading-tight"
          style={{
            color: tokens.colors.text,
            fontSize: tokens.typography.body.fontSize,
          }}
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Pricing Row: discounted in bold primary, original struck through */}
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span
            className="font-bold text-base"
            style={{ color: tokens.colors.primary }}
          >
            ${product.price.toFixed(2)}
          </span>
          {discount > 0 && (
            <span
              className="text-xs line-through"
              style={{ color: tokens.colors.mutedText }}
            >
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating row: star + value */}
        <div className="mt-1 flex items-center gap-1">
          <Star
            size={13}
            fill={tokens.colors.ratingStar}
            color={tokens.colors.ratingStar}
          />
          <span
            className="text-xs font-medium"
            style={{ color: tokens.colors.mutedText }}
          >
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
