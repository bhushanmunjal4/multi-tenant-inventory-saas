import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse } from "../types/api";
import type {
  Supplier,
  CreateSupplierDTO,
} from "../types/supplier";

/* ---------- FETCH ---------- */

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<ApiResponse<Supplier[]>>(
    API_ROUTES.SUPPLIERS
  );

  return response.data.data;
};

/* ---------- CREATE ---------- */

export const createSupplier = async (
  data: CreateSupplierDTO
): Promise<void> => {
  await api.post(API_ROUTES.SUPPLIERS, data);
};

/* ---------- UPDATE ---------- */

export const updateSupplier = async (
  supplierId: string,
  data: CreateSupplierDTO
): Promise<void> => {
  await api.put(`${API_ROUTES.SUPPLIERS}/${supplierId}`, data);
};

/* ---------- DELETE ---------- */

export const deleteSupplier = async (
  supplierId: string
): Promise<void> => {
  await api.delete(`${API_ROUTES.SUPPLIERS}/${supplierId}`);
};
