import { Product } from "../product/product.model";
import { StockMovement } from "../stockMovement/stockMovement.model";
import mongoose from "mongoose";

export const getDashboardData = async (tenantId: string) => {

  /* =========================
     1️⃣ Inventory Value
  ========================= */

const inventoryValueResult = await Product.aggregate([
  { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
  { $unwind: "$variants" },
  {
    $group: {
      _id: null,
      totalValue: {
        $sum: { $multiply: ["$variants.stock", "$variants.price"] }
      }
    }
  }
]);

const inventoryValue =
  inventoryValueResult[0]?.totalValue || 0;


  /* =========================
     2️⃣ Top 5 Sellers (30 days)
  ========================= */

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const topSellers = await StockMovement.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
        type: "SALE",
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          productId: "$productId",
          variantId: "$variantId"
        },
        totalSold: { $sum: { $abs: "$quantity" } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  /* =========================
     3️⃣ Stock Movement (7 days)
  ========================= */

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const stockGraph = await StockMovement.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        totalMovement: { $sum: "$quantity" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);

  return {
    inventoryValue,
    topSellers,
    stockGraph
  };
};
