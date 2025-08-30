import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/dbConnect";
import SubsidyRequest from "@/models/SubsidyRequest";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    const { producerId, amount, description, documents } = req.body;

    const subsidy = await SubsidyRequest.create({
      producer: producerId,
      amount,
      description,
      documents,
    });

    return res.status(201).json(subsidy);
  }

  res.status(405).json({ error: "Method not allowed" });
}
