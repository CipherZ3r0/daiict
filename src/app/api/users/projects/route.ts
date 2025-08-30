import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubsidyRequest from "@/models/SubsidyRequest";

export const config = { api: { bodyParser: false } }; // important for FormData

export async function POST(req: NextRequest) {
  await dbConnect();
  const userId = "68b3113e2ca855c0ce724fa6"; // replace with session auth

  // parse multipart form data
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const documents = formData.getAll("documents"); // array of uploaded files

  const newProject = await SubsidyRequest.create({
    producer: userId,
    description,
    amount: 0,
    milestones: [],
    documents: documents.map((file) => ({ name: (file as File).name })),
  });

  return NextResponse.json(newProject);
}
