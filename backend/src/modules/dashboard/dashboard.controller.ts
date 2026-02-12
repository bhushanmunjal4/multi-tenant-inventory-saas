import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getDashboardData } from "./dashboard.service";

export const getDashboardHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const data = await getDashboardData(tenantId);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
