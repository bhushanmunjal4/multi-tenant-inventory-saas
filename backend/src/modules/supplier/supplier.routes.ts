import { Router } from "express";
import {
  createSupplierHandler,
  getSuppliersHandler
} from "./supplier.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.get("/", authMiddleware, getSuppliersHandler);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["OWNER", "MANAGER"]),
  createSupplierHandler
);

export default router;
