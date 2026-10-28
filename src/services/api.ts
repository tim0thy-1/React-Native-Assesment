import { Product, ProductsApiResponse, SortField, SortOrder } from '../types/product';
import { AsyncStorage, STORAGE_KEYS } from './storage';

const BASE_URL = 'https://dummyjson.com';

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  searchQuery?: string;
  sortBy?: SortField;
  order?: SortOrder;
  signal?: AbortSignal;
}

// Global flag to simulate API failure for testing the scenario:
// "API failure -> Error message with Retry. Retry recovers without restarting the app."
let simulateApiFailure = false;

export function setSimulateApiFailure(fail: boolean) {
  simulateApiFailure = fail;
}

export function getSimulateApiFailure() {
  return simulateApiFailure;
}

/**
 * Fetch products list with search, sorting, pagination and AbortController support.
 * Also caches page 0 results for offline usage.
 */
export async function fetchProducts({
  limit = 20,
  skip = 0,
  searchQuery = '',
  sortBy,
  order = 'asc',
  signal,
}: FetchProductsParams): Promise<ProductsApiResponse> {
  if (simulateApiFailure) {
    throw new Error('Simulated network error: Failed to fetch products from API.');
  }

  const trimmedQuery = searchQuery.trim();
  let url = '';

  if (trimmedQuery) {
    const params = new URLSearchParams({
      q: trimmedQuery,
      limit: limit.toString(),
      skip: skip.toString(),
    });
    if (sortBy) {
      params.set('sortBy', sortBy);
      params.set('order', order);
    }
    url = `${BASE_URL}/products/search?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });
    if (sortBy) {
      params.set('sortBy', sortBy);
      params.set('order', order);
    }
    url = `${BASE_URL}/products?${params.toString()}`;
  }

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data: ProductsApiResponse = await response.json();

    // Cache the first page when it's default initial page (no search query & skip === 0)
    if (skip === 0 && !trimmedQuery && (!sortBy || sortBy === 'price')) {
      AsyncStorage.setItem(STORAGE_KEYS.FIRST_PAGE_CACHE, JSON.stringify(data.products)).catch(
        (err) => console.warn('Could not cache first page', err)
      );
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    // If skip === 0 and offline/network failed, check if we have cached first page
    if (skip === 0 && !trimmedQuery) {
      const cached = getCachedFirstPage();
      if (cached && cached.length > 0) {
        return {
          products: cached,
          total: cached.length,
          skip: 0,
          limit: cached.length,
        };
      }
    }
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
  if (simulateApiFailure) {
    throw new Error('Simulated network error: Failed to fetch product details.');
  }

  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`Product not found (${response.status})`);
  }
  return response.json();
}

/**
 * Get synchronously cached first page products (from AsyncStorage / memory)
 */
export function getCachedFirstPage(): Product[] | null {
  const cachedJson = AsyncStorage.getItemSync(STORAGE_KEYS.FIRST_PAGE_CACHE);
  if (cachedJson) {
    try {
      const parsed = JSON.parse(cachedJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore JSON errors
    }
  }
  return null;
}
