import mongoose, { Schema, Document } from "mongoose";

export enum SubsidyStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  TERMINATED = "TERMINATED",
  COMPLETED = "COMPLETED",
}

export interface ISubsidyRequest extends Document {
  producer: mongoose.Types.ObjectId;
  status: SubsidyStatus;
  amount: number;
  description: string;
  documents?: any[];
  milestones: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const SubsidyRequestSchema: Schema = new Schema({
  producer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: Object.values(SubsidyStatus), default: SubsidyStatus.PENDING },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  documents: [{ type: Object }],
  milestones: [{ type: Schema.Types.ObjectId, ref: "Milestone" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SubsidyRequest ||
  mongoose.model<ISubsidyRequest>("SubsidyRequest", SubsidyRequestSchema);
