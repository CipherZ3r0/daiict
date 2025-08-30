import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Wallet from "@/models/Wallet";

export async function POST(req: Request) {
  await dbConnect();
  const { fromUserId, toUserId, amount } = await req.json();

  const fromWallet = await Wallet.findOne({ userId: fromUserId });
  const toWallet = await Wallet.findOne({ userId: toUserId });

  if (!fromWallet || fromWallet.balance < amount) {
    return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
  }

  fromWallet.balance -= amount;
  toWallet.balance += amount;

  await fromWallet.save();
  await toWallet.save();

  return NextResponse.json({ success: true });
}
