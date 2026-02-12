import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";


export type UserRole = "OWNER" | "MANAGER" | "STAFF";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  tenantId: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["OWNER", "MANAGER", "STAFF"],
      required: true
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});




export const User = mongoose.model<IUser>("User", userSchema);
