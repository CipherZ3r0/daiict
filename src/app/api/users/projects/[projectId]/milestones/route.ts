import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Milestone from "@/models/Milestone";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  await dbConnect();
  const { projectId } = params;

  // parse multipart form data
  const formData = await req.formData();
  const milestoneId = formData.get("milestoneId") as string;
  const file = formData.get("file");

  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });

  // Save file info (for now, just store metadata, you can save files to /public/uploads if needed)
  if (file) {
    milestone.documents = milestone.documents || [];
    milestone.documents.push({ name: (file as File).name });
  }

  milestone.status = "completed";
  milestone.submissionDate = new Date();
  await milestone.save();

  return NextResponse.json(milestone);
}
