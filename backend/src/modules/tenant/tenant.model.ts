import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
  name: string;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);
