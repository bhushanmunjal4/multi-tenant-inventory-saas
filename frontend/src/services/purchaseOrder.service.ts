import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse } from "../types/api";
import type {
  PurchaseOrder,
  Supplier,
  ProductBasic,
  POItem,
} from "../types/purchaseOrder";

/* ---------- FETCH ---------- */

export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await api.get<ApiResponse<PurchaseOrder[]>>(
    API_ROUTES.PURCHASE_ORDERS
  );

  return response.data.data;
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<ApiResponse<Supplier[]>>(
    API_ROUTES.SUPPLIERS
  );

  return response.data.data;
};

export const fetchProductsBasic = async (): Promise<ProductBasic[]> => {
  const response = await api.get<
    ApiResponse<{ products: ProductBasic[] }>
  >(API_ROUTES.PRODUCTS.LIST);

  return response.data.data.products;
};

/* ---------- CREATE ---------- */

export const createPurchaseOrder = async (data: {
  supplierId: string;
  expectedDate: string;
  items: POItem[];
}): Promise<void> => {
  await api.post(API_ROUTES.PURCHASE_ORDERS, data);
};

/* ---------- RECEIVE ---------- */

export const receivePurchaseOrder = async (
  poId: string,
  items: { variantId: string; receiveQty: number }[]
): Promise<void> => {
  await api.post(`${API_ROUTES.PURCHASE_ORDERS}/${poId}/receive`, {
    items,
  });
};
