import mongoose, { Schema, Document } from "mongoose";

/* =========================
   Variant Interface
========================= */

export interface IVariant {
    _id: mongoose.Types.ObjectId;
  sku: string;
  attributes: {
    [key: string]: string; // dynamic attributes (size, color, etc.)
  };
  price: number;
  stock: number;
  lowStockThreshold: number;
}

/* =========================
   Product Interface
========================= */

export interface IProduct extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category?: string;
  variants: IVariant[];
}

/* =========================
   Variant Schema
========================= */

const variantSchema = new Schema<IVariant>(
  {
    sku: {
      type: String,
      required: true
    },
    attributes: {
      type: Map,
      of: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 5
    }
  },
  { _id: true }
);

/* =========================
   Product Schema
========================= */

const productSchema = new Schema<IProduct>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String
    },
    variants: {
      type: [variantSchema],
      validate: [
        (val: IVariant[]) => val.length > 0,
        "Product must have at least one variant"
      ]
    }
  },
  { timestamps: true }
);

/* =========================
   Indexing (Performance)
========================= */

// Frequently filtered by tenant
productSchema.index({ tenantId: 1, name: 1 });

// SKU search inside tenant
productSchema.index({ tenantId: 1, "variants.sku": 1 });

export const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);
