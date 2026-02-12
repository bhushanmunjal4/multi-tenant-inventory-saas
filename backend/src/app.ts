import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/product/product.routes";
import supplierRoutes from "./modules/supplier/supplier.routes";
import purchaseOrderRoutes from "./modules/purchaseOrder/purchaseOrder.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";


const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
