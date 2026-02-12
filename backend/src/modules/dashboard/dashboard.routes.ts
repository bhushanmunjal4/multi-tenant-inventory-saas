import { Router } from "express";
import { getDashboardHandler } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getDashboardHandler);

export default router;
