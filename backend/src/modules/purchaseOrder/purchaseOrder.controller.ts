import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createPurchaseOrder, receivePurchaseOrder } from "./purchaseOrder.service";
import { PurchaseOrder } from "./purchaseOrder.model";

export const createPurchaseOrderHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const po = await createPurchaseOrder(
      tenantId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: po
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const receivePurchaseOrderHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;
    const poId = req.params.poId as string;

    const updatedPO = await receivePurchaseOrder(
      tenantId,
      poId,
      req.body.items
    );

    res.status(200).json({
      success: true,
      data: updatedPO
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPurchaseOrdersHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const purchaseOrders = await PurchaseOrder.find({ tenantId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: purchaseOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
