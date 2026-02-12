import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createSupplier,
  getSuppliersByTenant
} from "./supplier.service";

export const createSupplierHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const supplier = await createSupplier({
      ...req.body,
      tenantId
    });

    res.status(201).json({
      success: true,
      data: supplier
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getSuppliersHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const suppliers = await getSuppliersByTenant(tenantId);

    res.status(200).json({
      success: true,
      data: suppliers
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
