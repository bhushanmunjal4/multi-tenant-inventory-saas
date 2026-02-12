import mongoose, { Schema, Document } from "mongoose";

export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "RETURN"
  | "ADJUSTMENT";

export interface IStockMovement extends Document {
  tenantId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  referenceId?: string;
}

const stockMovementSchema = new Schema<IStockMovement>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    variantId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    type: {
      type: String,
      enum: ["PURCHASE", "SALE", "RETURN", "ADJUSTMENT"],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    referenceId: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for dashboard queries
stockMovementSchema.index({ tenantId: 1, type: 1, createdAt: -1 });

export const StockMovement = mongoose.model<IStockMovement>(
  "StockMovement",
  stockMovementSchema
);
