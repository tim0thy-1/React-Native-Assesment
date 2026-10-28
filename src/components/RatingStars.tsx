import React from 'react';
import { Star } from 'lucide-react';
import { tokens } from '../theme/tokens';

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  showNumeric?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount,
  size = 14,
  showNumeric = true,
}) => {
  // Generate 5 star elements
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= fullStars;
          const isHalf = !isFilled && index === fullStars + 1 && hasHalfStar;

          return (
            <span key={index} className="relative inline-flex items-center">
              <Star
                size={size}
                fill={isFilled || isHalf ? tokens.colors.ratingStar : 'none'}
                color={isFilled || isHalf ? tokens.colors.ratingStar : tokens.colors.border}
                strokeWidth={isFilled || isHalf ? 0 : 1.5}
              />
            </span>
          );
        })}
      </div>

      {showNumeric && (
        <span
          className="text-xs font-semibold ml-0.5"
          style={{ color: tokens.colors.text }}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {typeof reviewsCount === 'number' && (
        <span
          className="text-xs ml-1"
          style={{ color: tokens.colors.mutedText }}
        >
          ({reviewsCount} reviews)
        </span>
      )}
    </div>
  );
};
