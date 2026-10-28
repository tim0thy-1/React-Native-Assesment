import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { tokens } from '../theme/tokens';

interface OfflineBannerProps {
  isOffline: boolean;
  onToggleAirplaneMode?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline, onToggleAirplaneMode }) => {
  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium border-b transition-all duration-300"
      style={{
        backgroundColor: tokens.colors.offlineBannerBackground,
        color: tokens.colors.offlineBannerText,
        borderColor: tokens.colors.offlineBannerBorder,
        minHeight: 36,
      }}
    >
      <div className="flex items-center gap-2">
        <WifiOff size={16} color={tokens.colors.offlineBannerText} className="shrink-0" />
        <span>You&apos;re offline - showing saved results</span>
      </div>
      {onToggleAirplaneMode && (
        <button
          onClick={onToggleAirplaneMode}
          type="button"
          className="underline hover:opacity-80 px-1 py-1 font-semibold text-xs ml-2 cursor-pointer"
          style={{ color: tokens.colors.offlineBannerText }}
          title="Toggle Airplane Mode"
        >
          Reconnect
        </button>
      )}
    </div>
  );
};
