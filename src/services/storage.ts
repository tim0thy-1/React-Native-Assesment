/**
 * AsyncStorage implementation for Web / React Native compatibility.
 * Provides the standard AsyncStorage API (getItem, setItem, removeItem, clear)
 * backed by localStorage with synchronous cache memory to avoid flash of empty content.
 */

const memoryStorage = new Map<string, string>();

// Initialize memory storage from localStorage if available
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        memoryStorage.set(key, window.localStorage.getItem(key) || '');
      }
    }
  }
} catch (e) {
  console.warn('LocalStorage not accessible, falling back to in-memory store', e);
}

export const AsyncStorage = {
  /**
   * Asynchronously retrieves a value for key
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) {
          memoryStorage.set(key, val);
          return val;
        }
      }
      return memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  },

  /**
   * Synchronous peek for instant hydration without flash of empty content
   */
  getItemSync(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  },

  /**
   * Asynchronously sets a value
   */
  async setItem(key: string, value: string): Promise<void> {
    memoryStorage.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Failed to write to localStorage', e);
    }
  },

  /**
   * Asynchronously removes a key
   */
  async removeItem(key: string): Promise<void> {
    memoryStorage.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Failed to remove from localStorage', e);
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    memoryStorage.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('Failed to clear localStorage', e);
    }
  },
};

export const STORAGE_KEYS = {
  FAVORITES: '@shoplite_favorites',
  FIRST_PAGE_CACHE: '@shoplite_first_page_cache',
  OFFLINE_OVERRIDE: '@shoplite_offline_override',
};
