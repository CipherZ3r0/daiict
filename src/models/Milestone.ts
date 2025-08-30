import mongoose, { Schema, Document } from "mongoose";

export type MilestoneStatus = "completed" | "in-progress" | "upcoming" | "overdue";

export interface IMilestone extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  status: MilestoneStatus;
  documents?: any[];
  submissionDate?: Date;
}

const MilestoneSchema: Schema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "SubsidyRequest", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["completed", "in-progress", "upcoming", "overdue"], default: "upcoming" },
  documents: [{ type: Object }],
  submissionDate: { type: Date }
});

export default mongoose.models.Milestone || mongoose.model<IMilestone>("Milestone", MilestoneSchema);
