import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  user: mongoose.Schema.Types.ObjectId;
  balance: number;
  walletNumber: string;
}

const WalletSchema = new Schema<IWallet>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  walletNumber: { type: String, unique: true, required: true }
});

export default mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema);
