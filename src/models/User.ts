import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: "Producer" | "Government" | "Auditor";
  walletAddress?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Producer", "Government", "Auditor"], required: true },
  walletAddress: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
