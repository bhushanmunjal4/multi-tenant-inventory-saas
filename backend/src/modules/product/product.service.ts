import mongoose from "mongoose";
import { Product, IProduct } from "./product.model";
import { StockMovement } from "../stockMovement/stockMovement.model";
import { PurchaseOrder } from "../purchaseOrder/purchaseOrder.model";

export const createProduct = async (
  productData: Partial<IProduct>
) => {
  const product = await Product.create(productData);
  return product;
};

export const getProductsByTenant = async (
  tenantId: string,
  skip: number,
  limit: number
) => {
  const filter = { tenantId };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 }) // recommended
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total };
};

export const sellVariant = async (
  tenantId: string,
  productId: string,
  variantId: string,
  quantity: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();


  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        tenantId,
        "variants._id": variantId,
        "variants.stock": { $gte: quantity }
      },
      {
        $inc: { "variants.$.stock": -quantity }
      },
      { new: true, session }
    );

    if (!product) {
      throw new Error("Insufficient stock");
    }

    await StockMovement.create(
      [
        {
          tenantId,
          productId,
          variantId,
          type: "SALE",
          quantity: -quantity
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return product;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getLowStockProducts = async (tenantId: string) => {

  const products = await Product.find({ tenantId }).lean();

  const confirmedPOs = await PurchaseOrder.find({
    tenantId,
    status: "CONFIRMED"
  }).lean();

  const lowStockVariants: any[] = [];

  for (const product of products) {
    for (const variant of product.variants) {

      // Calculate incoming stock from confirmed POs
      let incomingQty = 0;

      for (const po of confirmedPOs) {
        for (const item of po.items) {
          if (
            item.productId.toString() === product._id.toString() &&
            item.variantId.toString() === variant._id.toString()
          ) {
            incomingQty += (item.orderedQty - item.receivedQty);
          }
        }
      }

      const effectiveStock = variant.stock + incomingQty;

      if (effectiveStock <= variant.lowStockThreshold) {
        lowStockVariants.push({
          productId: product._id,
          productName: product.name,
          variantId: variant._id,
          sku: variant.sku,
          currentStock: variant.stock,
          incomingQty,
          effectiveStock,
          threshold: variant.lowStockThreshold
        });
      }
    }
  }

  return lowStockVariants;
};