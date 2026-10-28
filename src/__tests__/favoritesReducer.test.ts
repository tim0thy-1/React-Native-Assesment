import { describe, it, expect } from 'vitest';
import {
  favoritesReducer,
  initialFavoritesState,
  groupFavoritesByCategory,
} from '../context/favoritesReducer';
import { Product } from '../types/product';

const mockProductA: Product = {
  id: 1,
  title: 'iPhone 15 Pro',
  description: 'Flagship phone',
  category: 'smartphones',
  price: 999,
  discountPercentage: 10,
  rating: 4.8,
  stock: 25,
  thumbnail: 'https://example.com/thumb1.jpg',
  images: ['https://example.com/img1.jpg'],
};

const mockProductB: Product = {
  id: 2,
  title: 'Galaxy S24',
  description: 'Another smartphone',
  category: 'smartphones',
  price: 899,
  discountPercentage: 5,
  rating: 4.6,
  stock: 12,
  thumbnail: 'https://example.com/thumb2.jpg',
  images: ['https://example.com/img2.jpg'],
};

const mockProductC: Product = {
  id: 3,
  title: 'MacBook Air',
  description: 'Lightweight laptop',
  category: 'laptops',
  price: 1199,
  discountPercentage: 8,
  rating: 4.9,
  stock: 5,
  thumbnail: 'https://example.com/thumb3.jpg',
  images: ['https://example.com/img3.jpg'],
};

describe('favoritesReducer', () => {
  it('should initialize with initial state', () => {
    const state = favoritesReducer(initialFavoritesState, { type: 'CLEAR_ALL' });
    expect(state.favorites).toEqual([]);
    expect(state.recentlyRemoved).toBeNull();
    expect(state.snackbarVisible).toBe(false);
  });

  it('should hydrate saved favorites from storage', () => {
    const state = favoritesReducer(initialFavoritesState, {
      type: 'HYDRATE',
      payload: [mockProductA, mockProductB],
    });
    expect(state.favorites.length).toBe(2);
    expect(state.isHydrated).toBe(true);
    expect(state.favorites[0].id).toBe(mockProductA.id);
  });

  it('should add product to favorites and prevent duplicate additions', () => {
    let state = favoritesReducer(initialFavoritesState, {
      type: 'ADD_FAVORITE',
      payload: mockProductA,
    });
    expect(state.favorites.length).toBe(1);
    expect(state.favorites[0]).toEqual(mockProductA);

    // Duplicate add should not increase length
    state = favoritesReducer(state, {
      type: 'ADD_FAVORITE',
      payload: mockProductA,
    });
    expect(state.favorites.length).toBe(1);
  });

  it('should remove a favorite and save its original index for Undo', () => {
    const initialState = {
      ...initialFavoritesState,
      favorites: [mockProductA, mockProductB, mockProductC],
    };

    // Remove mockProductB (index 1)
    const state = favoritesReducer(initialState, {
      type: 'REMOVE_FAVORITE',
      payload: { id: mockProductB.id },
    });

    expect(state.favorites.length).toBe(2);
    expect(state.favorites.map((p) => p.id)).toEqual([mockProductA.id, mockProductC.id]);
    expect(state.snackbarVisible).toBe(true);
    expect(state.recentlyRemoved).toEqual({
      product: mockProductB,
      originalIndex: 1,
    });
  });

  it('should restore item in its original position when UNDO_REMOVE is dispatched', () => {
    const initialState = {
      ...initialFavoritesState,
      favorites: [mockProductA, mockProductB, mockProductC],
    };

    // 1. Remove mockProductB (at index 1)
    const removedState = favoritesReducer(initialState, {
      type: 'REMOVE_FAVORITE',
      payload: { id: mockProductB.id },
    });

    // 2. Undo removal
    const restoredState = favoritesReducer(removedState, {
      type: 'UNDO_REMOVE',
    });

    // Check item is restored at index 1
    expect(restoredState.favorites.length).toBe(3);
    expect(restoredState.favorites[1].id).toBe(mockProductB.id);
    expect(restoredState.favorites.map((p) => p.id)).toEqual([
      mockProductA.id,
      mockProductB.id,
      mockProductC.id,
    ]);
    expect(restoredState.recentlyRemoved).toBeNull();
    expect(restoredState.snackbarVisible).toBe(false);
  });

  it('should dismiss snackbar cleanly', () => {
    const stateWithSnackbar = {
      ...initialFavoritesState,
      favorites: [mockProductA],
      recentlyRemoved: { product: mockProductB, originalIndex: 1 },
      snackbarVisible: true,
    };

    const dismissedState = favoritesReducer(stateWithSnackbar, {
      type: 'DISMISS_SNACKBAR',
    });

    expect(dismissedState.snackbarVisible).toBe(false);
    expect(dismissedState.recentlyRemoved).toBeNull();
  });
});

describe('groupFavoritesByCategory', () => {
  it('should group items by category with uppercase titles and correct counts', () => {
    const favorites = [mockProductA, mockProductB, mockProductC];
    const sections = groupFavoritesByCategory(favorites);

    expect(sections.length).toBe(2);

    const smartphonesSection = sections.find((s) => s.category === 'smartphones');
    expect(smartphonesSection).toBeDefined();
    expect(smartphonesSection?.title).toBe('SMARTPHONES');
    expect(smartphonesSection?.data.length).toBe(2);

    const laptopsSection = sections.find((s) => s.category === 'laptops');
    expect(laptopsSection).toBeDefined();
    expect(laptopsSection?.title).toBe('LAPTOPS');
    expect(laptopsSection?.data.length).toBe(1);
  });
});
