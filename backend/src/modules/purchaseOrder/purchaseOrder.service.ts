import { PurchaseOrder, IPurchaseOrder } from "./purchaseOrder.model";
import { Supplier } from "../supplier/supplier.model";
import { Product } from "../product/product.model";
import { StockMovement } from "../stockMovement/stockMovement.model";
import mongoose from "mongoose";

export const createPurchaseOrder = async (
  tenantId: string,
  data: Partial<IPurchaseOrder>
) => {

  // 1️⃣ Validate supplier belongs to tenant
  const supplier = await Supplier.findOne({
    _id: data.supplierId,
    tenantId
  });

  if (!supplier) {
    throw new Error("Invalid supplier for this tenant");
  }

  // 2️⃣ Validate each product belongs to tenant
  for (const item of data.items || []) {
    const product = await Product.findOne({
      _id: item.productId,
      tenantId
    });

    if (!product) {
      throw new Error("Invalid product for this tenant");
    }
  }

  // 3️⃣ Create PO
  const po = await PurchaseOrder.create({
    ...data,
    tenantId,
    status: "DRAFT"
  });

  return po;
};

export const receivePurchaseOrder = async (
  tenantId: string,
  poId: string,
  itemsToReceive: { variantId: string; receiveQty: number }[]
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const po = await PurchaseOrder.findOne({
      _id: poId,
      tenantId
    }).session(session);

    if (!po) {
      throw new Error("Purchase Order not found");
    }

    for (const item of itemsToReceive) {

      const poItem = po.items.find(
        i => i.variantId.toString() === item.variantId
      );

      if (!poItem) {
        throw new Error("Variant not part of this PO");
      }

      const remainingQty = poItem.orderedQty - poItem.receivedQty;

      if (item.receiveQty > remainingQty) {
        throw new Error("Receiving more than ordered quantity");
      }

      // 1️⃣ Increase stock
      await Product.updateOne(
        {
          _id: poItem.productId,
          tenantId,
          "variants._id": item.variantId
        },
        {
          $inc: { "variants.$.stock": item.receiveQty }
        },
        { session }
      );

      // 2️⃣ Update receivedQty
      poItem.receivedQty += item.receiveQty;

      // 3️⃣ Create StockMovement
      await StockMovement.create(
        [
          {
            tenantId,
            productId: poItem.productId,
            variantId: item.variantId,
            type: "PURCHASE",
            quantity: item.receiveQty
          }
        ],
        { session }
      );
    }

    // 4️⃣ Update status if fully received
    const allReceived = po.items.every(
      i => i.receivedQty === i.orderedQty
    );

    if (allReceived) {
      po.status = "RECEIVED";
    }

    await po.save({ session });

    await session.commitTransaction();
    session.endSession();

    return po;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};