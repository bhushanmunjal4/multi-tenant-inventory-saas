import api from "../api/axios";
import type { ApiResponse } from "../types/api";
import type { Product, PaginatedProducts, NewProduct } from "../types/product";
import { API_ROUTES } from "../constants/apiRoutes";


export const getProducts = async (
  page: number,
  limit: number
): Promise<PaginatedProducts> => {
  const res = await api.get<ApiResponse<PaginatedProducts>>(
    `${API_ROUTES.PRODUCTS.LIST}?page=${page}&limit=${limit}`
  );

  return res.data.data;
};

export const createProduct = async (
  payload: NewProduct
): Promise<Product> => {
  const res = await api.post<ApiResponse<Product>>(
    API_ROUTES.PRODUCTS.CREATE,
    payload
  );

  return res.data.data;
};

export const updateProduct = async (
  id: string,
  payload: Product
): Promise<Product> => {
  const res = await api.put<ApiResponse<Product>>(
    API_ROUTES.PRODUCTS.UPDATE(id),
    payload
  );

  return res.data.data;
};


export const deleteProduct = async (
  id: string
): Promise<void> => {
  await api.delete(API_ROUTES.PRODUCTS.DELETE(id));
};


export const sellVariant = async (
  productId: string,
  variantId: string,
  quantity: number
): Promise<void> => {
  await api.post(
    API_ROUTES.PRODUCTS.SELL(productId, variantId),
    { quantity }
  );
};


export const updateVariant = async (
  productId: string,
  variantId: string,
  payload: Record<string, unknown>
): Promise<void> => {
  await api.patch(
    API_ROUTES.PRODUCTS.UPDATE_VARIANT(productId, variantId),
    payload
  );
};
