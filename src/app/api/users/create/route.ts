import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Wallet from "../../../../models/Wallet";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({ name, email, password, role });
    console.log("📥 Incoming user registration request");

    // Create wallet if producer or government
    if (role === "producer" || role === "government") {
      const walletNumber =
        "WALLET-" + Math.floor(100000 + Math.random() * 900000);
      await Wallet.create({ user: user._id, walletNumber });
    }

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
