import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { Product, FavoritesSection } from '../types/product';
import {
  favoritesReducer,
  initialFavoritesState,
  FavoritesState,
  groupFavoritesByCategory,
} from './favoritesReducer';
import { AsyncStorage, STORAGE_KEYS } from '../services/storage';

interface FavoritesContextValue {
  favorites: Product[];
  sections: FavoritesSection[];
  favoritesCount: number;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (id: number) => void;
  undoRemove: () => void;
  dismissSnackbar: () => void;
  snackbarVisible: boolean;
  recentlyRemoved: FavoritesState['recentlyRemoved'];
  isHydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously initialize from storage to prevent flash of empty content
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState, () => {
    const cached = AsyncStorage.getItemSync(STORAGE_KEYS.FAVORITES);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return {
            ...initialFavoritesState,
            favorites: parsed,
            isHydrated: true,
          };
        }
      } catch (err) {
        console.warn('Failed to parse cached favorites', err);
      }
    }
    return initialFavoritesState;
  });

  const snackbarTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Async hydration fallback if storage was async
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEYS.FAVORITES).then((val) => {
      if (isMounted && val) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'HYDRATE', payload: parsed });
          }
        } catch {}
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to AsyncStorage whenever favorites array changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites)).catch((err) => {
      console.warn('Failed to persist favorites', err);
    });
  }, [state.favorites]);

  // Handle 4-second Undo snackbar timer
  useEffect(() => {
    if (state.snackbarVisible) {
      if (snackbarTimerRef.current) {
        clearTimeout(snackbarTimerRef.current);
      }
      snackbarTimerRef.current = setTimeout(() => {
        dispatch({ type: 'DISMISS_SNACKBAR' });
      }, 4000);
    } else {
      if (snackbarTimerRef.current) {
        clearTimeout(snackbarTimerRef.current);
        snackbarTimerRef.current = null;
      }
    }

    return () => {
      if (snackbarTimerRef.current) {
        clearTimeout(snackbarTimerRef.current);
      }
    };
  }, [state.snackbarVisible, state.recentlyRemoved]);

  const isFavorite = useCallback(
    (id: number) => {
      return state.favorites.some((item) => item.id === id);
    },
    [state.favorites]
  );

  const addFavorite = useCallback((product: Product) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: { id } });
  }, []);

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorite(product.id)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const undoRemove = useCallback(() => {
    dispatch({ type: 'UNDO_REMOVE' });
  }, []);

  const dismissSnackbar = useCallback(() => {
    dispatch({ type: 'DISMISS_SNACKBAR' });
  }, []);

  const sections = React.useMemo(() => {
    return groupFavoritesByCategory(state.favorites);
  }, [state.favorites]);

  const value: FavoritesContextValue = {
    favorites: state.favorites,
    sections,
    favoritesCount: state.favorites.length,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    undoRemove,
    dismissSnackbar,
    snackbarVisible: state.snackbarVisible,
    recentlyRemoved: state.recentlyRemoved,
    isHydrated: state.isHydrated,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
