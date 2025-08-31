import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubsidyRequest, { SubsidyStatus } from "@/models/SubsidyRequest";
import mongoose from "mongoose";
import { User } from "@/models/User";


// GET all projects
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const projects = await SubsidyRequest.find().populate("producer");
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST new project
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.formData();
    const name = data.get("name") as string;
    const description = data.get("description") as string;

    // Replace with actual producer ID (from auth/session)
    const producerId = new mongoose.Types.ObjectId("68b3113e2ca855c0ce724fa6");

    const newSubsidy = await SubsidyRequest.create({
      producer: producerId,
      status: SubsidyStatus.PENDING,
      amount: 0,
      description,
      documents: [], // handle uploaded files later
      milestones: [],
    });

    return NextResponse.json(newSubsidy, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to apply project" }, { status: 500 });
  }
}
