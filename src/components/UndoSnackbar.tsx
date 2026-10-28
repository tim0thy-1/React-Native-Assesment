import React from 'react';
import { tokens } from '../theme/tokens';

interface UndoSnackbarProps {
  visible: boolean;
  onUndo: () => void;
  message?: string;
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({
  visible,
  onUndo,
  message = 'Removed from favorites',
}) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="absolute bottom-20 left-4 right-4 z-40 flex items-center justify-between px-4 py-3 rounded-lg shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{
        backgroundColor: tokens.colors.snackbarBackground,
        color: tokens.colors.snackbarText,
        borderRadius: tokens.radius.button,
      }}
    >
      <span className="text-sm font-medium">{message}</span>

      <button
        type="button"
        onClick={onUndo}
        className="font-bold text-sm tracking-wider uppercase px-3 py-2 cursor-pointer transition-opacity hover:opacity-85 active:scale-95 flex items-center justify-center"
        style={{
          color: '#818CF8', // high-contrast light primary
          minWidth: 44,
          minHeight: 44,
        }}
        aria-label="Undo favorite removal"
      >
        UNDO
      </button>
    </div>
  );
};
