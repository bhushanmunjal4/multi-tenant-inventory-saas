export const API_ROUTES = {
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SELL: (productId: string, variantId: string) =>
      `/products/${productId}/variants/${variantId}/sell`,
    UPDATE_VARIANT: (productId: string, variantId: string) =>
      `/products/${productId}/variants/${variantId}`,
  },

  DASHBOARD: "/dashboard",
  SUPPLIERS: "/suppliers",
  LOW_STOCK: "/products/low-stock",
  PURCHASE_ORDERS: "/purchase-orders",
};
