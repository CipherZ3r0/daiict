import mongoose, { Schema, Document } from "mongoose";

export interface IProducer extends Document {
  name: string;
  email: string;
  walletVerified: boolean;
}

const ProducerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  walletVerified: { type: Boolean, default: false },
});

export default mongoose.models.Producer || mongoose.model<IProducer>("Producer", ProducerSchema);
