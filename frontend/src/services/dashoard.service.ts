import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type { ApiResponse } from "../types/api";
import type { DashboardData } from "../types/dashboard";

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<ApiResponse<DashboardData>>(
    API_ROUTES.DASHBOARD
  );

  return response.data.data;
};
