import React from 'react';
import { tokens } from '../theme/tokens';

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  let label = '';
  let color: string = tokens.colors.success;
  let bg = '#DCFCE7'; // soft green

  if (stock <= 0) {
    label = 'Out of stock';
    color = tokens.colors.danger;
    bg = '#FEE2E2'; // soft red
  } else if (stock < 10) {
    label = `Only ${stock} left`;
    color = tokens.colors.warning;
    bg = '#FEF3C7'; // soft amber
  } else {
    label = `In stock (${stock})`;
    color = tokens.colors.success;
    bg = '#DCFCE7'; // soft green
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 font-medium text-xs shadow-xs"
      style={{
        borderRadius: tokens.radius.full,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
};
