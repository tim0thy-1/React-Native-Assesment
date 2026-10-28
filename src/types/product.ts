export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews?: ProductReview[];
  tags?: string[];
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface FavoritesSection {
  title: string; // e.g. "SMARTPHONES"
  category: string;
  data: Product[];
}
