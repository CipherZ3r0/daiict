import mongoose, { Schema, Document } from "mongoose";

interface Milestone {
  description: string;
  amount: number;
  verified: boolean;
}

export interface IProject extends Document {
  name: string;
  description: string;
  producer: mongoose.Schema.Types.ObjectId | string;
  milestones: Milestone[];
  approved: boolean;
  fundsReleased: boolean;
}

const MilestoneSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  verified: { type: Boolean, default: false },
});

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  producer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  milestones: [MilestoneSchema],
  approved: { type: Boolean, default: false },
  fundsReleased: { type: Boolean, default: false },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
