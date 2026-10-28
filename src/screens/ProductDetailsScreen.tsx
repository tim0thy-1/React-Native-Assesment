import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { tokens } from '../theme/tokens';
import { ImageCarousel } from '../components/ImageCarousel';
import { StockBadge } from '../components/StockBadge';
import { RatingStars } from '../components/RatingStars';
import { useFavorites } from '../context/FavoritesContext';
import { fetchProductById } from '../services/api';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';

interface ProductDetailsScreenProps {
  productId: number;
  initialProduct?: Product | null;
  onBack: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  productId,
  initialProduct,
  onBack,
}) => {
  // Requirement: "Render instantly using the product data already loaded in the list, then refresh it from the API in the background"
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [isLoadingDirect, setIsLoadingDirect] = useState<boolean>(!initialProduct);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();

  // Background refresh or direct fetch if not already loaded
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetchProductById(productId, controller.signal)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setIsLoadingDirect(false);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          console.warn('Background refresh product failed:', err);
          if (!initialProduct) {
            setError(err.message || 'Failed to load product details.');
            setIsLoadingDirect(false);
          }
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productId, initialProduct]);

  if (isLoadingDirect && !product) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: tokens.colors.background }}
      >
        <Loader2 size={32} className="animate-spin mb-3" color={tokens.colors.primary} />
        <p className="text-xs font-medium" style={{ color: tokens.colors.mutedText }}>
          Loading product #{productId}...
        </p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: tokens.colors.background }}
      >
        <p className="text-sm font-semibold mb-2" style={{ color: tokens.colors.danger }}>
          {error}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold rounded-lg"
          style={{
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) return null;

  const currentIsFav = isFavorite(product.id);
  const discount = product.discountPercentage || 0;
  const originalPrice = discount > 0 ? product.price / (1 - discount / 100) : product.price;

  // Subtitle e.g. "Apple • smartphones"
  const brandCategoryText = [product.brand, product.category]
    .filter(Boolean)
    .join(' • ');

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto select-none"
      style={{
        backgroundColor: tokens.colors.background,
      }}
    >
      {/* 40% Full-width image carousel with indicator dots and floating buttons */}
      <ImageCarousel
        images={product.images && product.images.length > 0 ? product.images : [product.thumbnail]}
        title={product.title}
        isFavorite={currentIsFav}
        onBack={onBack}
        onToggleFavorite={() => toggleFavorite(product)}
      />

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title (heading) */}
        <h1
          className="font-semibold text-lg leading-snug"
          style={{
            color: tokens.colors.text,
            fontSize: tokens.typography.heading.fontSize,
          }}
        >
          {product.title}
        </h1>

        {/* Brand & Category in muted text */}
        {brandCategoryText && (
          <p
            className="text-xs font-medium mt-1 capitalize"
            style={{ color: tokens.colors.mutedText }}
          >
            {brandCategoryText}
          </p>
        )}

        {/* Price row: discounted price large in primary color, original price struck through, and a green discount badge */}
        <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
          <span
            className="text-2xl font-bold"
            style={{ color: tokens.colors.primary }}
          >
            ${product.price.toFixed(2)}
          </span>

          {discount > 0 && (
            <>
              <span
                className="text-sm line-through"
                style={{ color: tokens.colors.mutedText }}
              >
                ${originalPrice.toFixed(2)}
              </span>

              <span
                className="px-2 py-0.5 text-xs font-bold rounded-md"
                style={{
                  backgroundColor: '#DCFCE7',
                  color: tokens.colors.success,
                }}
              >
                -{Math.round(discount)}%
              </span>
            </>
          )}
        </div>

        {/* Five-star rating row with numeric value and reviews count */}
        <div className="mt-3 flex items-center">
          <RatingStars
            rating={product.rating}
            reviewsCount={product.reviews?.length || 94}
            size={16}
          />
        </div>

        {/* Stock pill */}
        <div className="mt-3.5">
          <StockBadge stock={product.stock} />
        </div>

        {/* Divider */}
        <div
          className="my-4 h-px w-full"
          style={{ backgroundColor: tokens.colors.border }}
        />

        {/* Description section */}
        <div className="flex-1">
          <h2
            className="font-semibold text-sm mb-1.5"
            style={{ color: tokens.colors.text }}
          >
            Description
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: tokens.colors.mutedText,
              fontSize: tokens.typography.body.fontSize,
            }}
          >
            {product.description}
          </p>
        </div>

        {/* Bottom Full-width primary button that reads "Add to Favorites" or "Remove from Favorites" */}
        <div className="pt-6 pb-2">
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 font-semibold text-sm transition-transform active:scale-[0.98] shadow-md cursor-pointer"
            style={{
              backgroundColor: currentIsFav ? tokens.colors.primary : tokens.colors.primary,
              color: tokens.colors.white,
              borderRadius: tokens.radius.button,
              minHeight: tokens.touchTarget.minHeight,
            }}
          >
            <Heart
              size={18}
              fill={currentIsFav ? tokens.colors.white : 'none'}
              color={tokens.colors.white}
            />
            <span>{currentIsFav ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
