import React from 'react';
import { tokens } from '../theme/tokens';

export const SkeletonCard: React.FC = () => {
  return (
    <div
      className="flex flex-col overflow-hidden animate-pulse select-none"
      style={{
        backgroundColor: tokens.colors.cardBackground,
        borderRadius: tokens.radius.card,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      {/* Square skeleton image */}
      <div
        className="w-full aspect-square"
        style={{ backgroundColor: tokens.colors.skeletonBackground }}
      />

      {/* Content lines */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2">
        <div
          className="w-full h-4 rounded"
          style={{ backgroundColor: tokens.colors.skeletonBackground }}
        />
        <div
          className="w-3/4 h-4 rounded"
          style={{ backgroundColor: tokens.colors.skeletonBackground }}
        />

        <div className="mt-2 flex items-center gap-2">
          <div
            className="w-16 h-5 rounded"
            style={{ backgroundColor: tokens.colors.skeletonBackground }}
          />
          <div
            className="w-10 h-4 rounded"
            style={{ backgroundColor: tokens.colors.skeletonBackground }}
          />
        </div>

        <div className="mt-1 flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: tokens.colors.skeletonBackground }}
          />
          <div
            className="w-8 h-3 rounded"
            style={{ backgroundColor: tokens.colors.skeletonBackground }}
          />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
