import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

const supplierSchema = new Schema<ISupplier>(
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
    email: String,
    phone: String,
    address: String
  },
  { timestamps: true }
);

supplierSchema.index({ tenantId: 1 });

export const Supplier = mongoose.model<ISupplier>(
  "Supplier",
  supplierSchema
);
