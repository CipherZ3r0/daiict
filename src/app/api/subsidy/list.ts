import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubsidyRequest from "@/models/SubsidyRequest";

export async function GET() {
  await dbConnect();
  const subsidies = await SubsidyRequest.find().populate("producerId");
  return NextResponse.json(subsidies);
}
