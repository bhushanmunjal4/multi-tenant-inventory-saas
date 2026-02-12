export interface Variant {
  _id: string;
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  attributes: Record<string, string>;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  description?: string;
  variants: Variant[];
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// For creating new products (without _id)
export interface NewProductVariant {
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  attributes: Record<string, string>; // Use Record<string, string> instead of specific shape
}

export interface NewProduct {
  name: string;
  category: string;
  description: string;
  variants: NewProductVariant[];
}

// Type for the initial state with specific attribute structure
export type NewProductState = {
  name: string;
  category: string;
  description: string;
  variants: {
    sku: string;
    price: number;
    stock: number;
    lowStockThreshold: number;
    attributes: {
      size: string;
      color: string;
    };
  }[];
};