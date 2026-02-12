import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse } from "../types/api";
import type { LowStockItem } from "../types/lowStock";

export const fetchLowStockItems = async (): Promise<LowStockItem[]> => {
  const response = await api.get<ApiResponse<LowStockItem[]>>(
    API_ROUTES.LOW_STOCK
  );

  return response.data.data;
};
