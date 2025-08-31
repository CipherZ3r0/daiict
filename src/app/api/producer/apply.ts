import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import SubsidyRequest, { SubsidyStatus } from "@/models/SubsidyRequest";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { name, description } = req.body;
      // For simplicity, link to first producer
      const producerId = new mongoose.Types.ObjectId("PUT_PRODUCER_ID_HERE");

      const newSubsidy = await SubsidyRequest.create({
        producer: producerId,
        status: SubsidyStatus.PENDING,
        amount: 0, // optional
        description,
        documents: [], // handle files separately
        milestones: [],
      });

      res.status(201).json(newSubsidy);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create subsidy request" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
