import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Producer from "@/models/Producer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { producerId } = req.query;
  await dbConnect();

  if (req.method === "PATCH") {
    try {
      const { verified } = req.body;
      const producer = await Producer.findByIdAndUpdate(
        producerId,
        { walletVerified: verified },
        { new: true }
      );

      if (!producer) return res.status(404).json({ error: "Producer not found" });

      res.status(200).json(producer);
    } catch (err) {
      res.status(500).json({ error: "Failed to update wallet status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
