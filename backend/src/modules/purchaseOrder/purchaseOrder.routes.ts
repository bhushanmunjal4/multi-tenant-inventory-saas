import { Router } from "express";
import { createPurchaseOrderHandler, receivePurchaseOrderHandler, getPurchaseOrdersHandler } from "./purchaseOrder.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["OWNER", "MANAGER"]),
  createPurchaseOrderHandler
);

router.post(
  "/:poId/receive",
  authMiddleware,
  roleMiddleware(["OWNER", "MANAGER"]),
  receivePurchaseOrderHandler
);

router.get(
  "/",
  authMiddleware,
  getPurchaseOrdersHandler
);

export default router;
