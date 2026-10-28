import { Product, FavoritesSection } from '../types/product';

export interface RemovedFavoriteInfo {
  product: Product;
  originalIndex: number;
}

export interface FavoritesState {
  favorites: Product[];
  recentlyRemoved: RemovedFavoriteInfo | null;
  snackbarVisible: boolean;
  isHydrated: boolean;
}

export type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: { id: number } }
  | { type: 'UNDO_REMOVE' }
  | { type: 'DISMISS_SNACKBAR' }
  | { type: 'HYDRATE'; payload: Product[] }
  | { type: 'CLEAR_ALL' };

export const initialFavoritesState: FavoritesState = {
  favorites: [],
  recentlyRemoved: null,
  snackbarVisible: false,
  isHydrated: false,
};

export function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case 'HYDRATE': {
      return {
        ...state,
        favorites: action.payload,
        isHydrated: true,
      };
    }

    case 'ADD_FAVORITE': {
      // Prevent duplicates
      if (state.favorites.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [action.payload, ...state.favorites],
      };
    }

    case 'REMOVE_FAVORITE': {
      const index = state.favorites.findIndex((item) => item.id === action.payload.id);
      if (index === -1) {
        return state;
      }
      const productToRemove = state.favorites[index];
      const nextFavorites = state.favorites.filter((item) => item.id !== action.payload.id);

      return {
        ...state,
        favorites: nextFavorites,
        recentlyRemoved: {
          product: productToRemove,
          originalIndex: index,
        },
        snackbarVisible: true,
      };
    }

    case 'UNDO_REMOVE': {
      if (!state.recentlyRemoved) {
        return state;
      }
      const { product, originalIndex } = state.recentlyRemoved;

      // Prevent duplicate if already added
      if (state.favorites.some((item) => item.id === product.id)) {
        return {
          ...state,
          recentlyRemoved: null,
          snackbarVisible: false,
        };
      }

      const nextFavorites = [...state.favorites];
      const insertAt = Math.min(originalIndex, nextFavorites.length);
      nextFavorites.splice(insertAt, 0, product);

      return {
        ...state,
        favorites: nextFavorites,
        recentlyRemoved: null,
        snackbarVisible: false,
      };
    }

    case 'DISMISS_SNACKBAR': {
      return {
        ...state,
        recentlyRemoved: null,
        snackbarVisible: false,
      };
    }

    case 'CLEAR_ALL': {
      return {
        ...state,
        favorites: [],
        recentlyRemoved: null,
        snackbarVisible: false,
      };
    }

    default:
      return state;
  }
}

/**
 * Helper to group a list of products into category sections (SectionList format)
 * e.g. "SMARTPHONES (2)"
 */
export function groupFavoritesByCategory(favorites: Product[]): FavoritesSection[] {
  const groups = new Map<string, Product[]>();

  favorites.forEach((product) => {
    const rawCategory = product.category || 'other';
    if (!groups.has(rawCategory)) {
      groups.set(rawCategory, []);
    }
    groups.get(rawCategory)!.push(product);
  });

  const sections: FavoritesSection[] = [];
  groups.forEach((items, category) => {
    // Format title: uppercase category e.g. "SMARTPHONES"
    const title = category.replace(/-/g, ' ').toUpperCase();
    sections.push({
      title,
      category,
      data: items,
    });
  });

  return sections;
}
