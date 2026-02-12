import { Router } from "express";
import { createProductHandler, getLowStockHandler, getProductByIdHandler, getProductsHandler, sellVariantHandler, updateProductHandler } from "./product.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["OWNER", "MANAGER"]),
  createProductHandler
);

router.post(
  "/:productId/variants/:variantId/sell",
  authMiddleware,
  sellVariantHandler
);

router.get(
  "/",
  authMiddleware,
  getProductsHandler
);

router.get(
  "/low-stock",
  authMiddleware,
  getLowStockHandler
);

router.get(
  "/:productId",
  authMiddleware,
  getProductByIdHandler
);

router.put(
  "/:productId",
  authMiddleware,
  roleMiddleware(["OWNER", "MANAGER"]),
  updateProductHandler
);

export default router;
