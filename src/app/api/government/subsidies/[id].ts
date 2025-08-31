import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import SubsidyRequest, { SubsidyStatus } from "@/models/Subsidy";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === "PATCH") {
    try {
      const { action } = req.body;

      if (!Object.values(SubsidyStatus).includes(action)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const subsidy = await SubsidyRequest.findByIdAndUpdate(
        id,
        { status: action },
        { new: true }
      ).populate("producer");

      if (!subsidy) return res.status(404).json({ error: "Subsidy not found" });

      res.status(200).json(subsidy);
    } catch (err) {
      res.status(500).json({ error: "Failed to update subsidy" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
