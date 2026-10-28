import React from 'react';
import { Home, Heart } from 'lucide-react';
import { tokens } from '../theme/tokens';

export type TabType = 'home' | 'favorites';

interface BottomTabBarProps {
  activeTab: TabType;
  favoritesCount: number;
  onSelectTab: (tab: TabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  favoritesCount,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="w-full flex items-center justify-around border-t select-none transition-colors"
      style={{
        backgroundColor: tokens.colors.white,
        borderColor: tokens.colors.border,
        minHeight: 56,
        height: 56,
      }}
    >
      {/* Home Tab */}
      <button
        type="button"
        onClick={() => onSelectTab('home')}
        className="flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer"
        style={{
          minHeight: tokens.touchTarget.minHeight,
          minWidth: tokens.touchTarget.minWidth,
          color: activeTab === 'home' ? tokens.colors.tabActive : tokens.colors.tabInactive,
        }}
        aria-selected={activeTab === 'home'}
        role="tab"
      >
        <Home
          size={22}
          color={activeTab === 'home' ? tokens.colors.tabActive : tokens.colors.tabInactive}
          strokeWidth={activeTab === 'home' ? 2.3 : 1.8}
        />
        <span
          className="text-[11px] font-medium mt-0.5"
          style={{
            color: activeTab === 'home' ? tokens.colors.tabActive : tokens.colors.tabInactive,
            fontWeight: activeTab === 'home' ? 600 : 500,
          }}
        >
          Home
        </span>
      </button>

      {/* Favorites Tab with Badge */}
      <button
        type="button"
        onClick={() => onSelectTab('favorites')}
        className="flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative"
        style={{
          minHeight: tokens.touchTarget.minHeight,
          minWidth: tokens.touchTarget.minWidth,
          color: activeTab === 'favorites' ? tokens.colors.tabActive : tokens.colors.tabInactive,
        }}
        aria-selected={activeTab === 'favorites'}
        role="tab"
      >
        <div className="relative inline-flex items-center justify-center">
          <Heart
            size={22}
            color={activeTab === 'favorites' ? tokens.colors.tabActive : tokens.colors.tabInactive}
            fill={activeTab === 'favorites' ? `${tokens.colors.tabActive}20` : 'none'}
            strokeWidth={activeTab === 'favorites' ? 2.3 : 1.8}
          />

          {/* Red badge on Favorites tab showing the number of saved items */}
          {favoritesCount > 0 && (
            <span
              className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: tokens.colors.badgeBackground,
                color: tokens.colors.badgeText,
              }}
            >
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </span>
          )}
        </div>
        <span
          className="text-[11px] font-medium mt-0.5"
          style={{
            color: activeTab === 'favorites' ? tokens.colors.tabActive : tokens.colors.tabInactive,
            fontWeight: activeTab === 'favorites' ? 600 : 500,
          }}
        >
          Favorites
        </span>
      </button>
    </nav>
  );
};
