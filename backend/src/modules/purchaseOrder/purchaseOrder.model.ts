import mongoose, { Schema, Document } from "mongoose";

export type POStatus =
  | "DRAFT"
  | "SENT"
  | "CONFIRMED"
  | "RECEIVED";

export interface IPOItem {
  productId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  orderedQty: number;
  receivedQty: number;
  price: number;
}

export interface IPurchaseOrder extends Document {
  tenantId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  items: IPOItem[];
  status: POStatus;
  expectedDate?: Date;
}

const poItemSchema = new Schema<IPOItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  variantId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  orderedQty: {
    type: Number,
    required: true,
    min: 1
  },
  receivedQty: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },
    items: {
      type: [poItemSchema],
      validate: [
        (val: IPOItem[]) => val.length > 0,
        "Purchase Order must have at least one item"
      ]
    },
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "CONFIRMED", "RECEIVED"],
      default: "DRAFT"
    },
    expectedDate: Date
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ tenantId: 1, status: 1 });

export const PurchaseOrder = mongoose.model<IPurchaseOrder>(
  "PurchaseOrder",
  purchaseOrderSchema
);
