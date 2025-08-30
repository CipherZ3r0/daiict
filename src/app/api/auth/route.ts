import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const { name, role, walletAddress } = await req.json();
  await connectToDB();

  let user = await User.findOne({ name, role });
  if (!user) {
    user = await User.create({ name, role, walletAddress });
  }

  return NextResponse.json({ user });
}
