import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "producer" | "government" | "auditor";
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["producer", "government", "auditor"], required: true },
});

export const User: Model<IUser> = models.User || mongoose.model<IUser>("User", UserSchema);
