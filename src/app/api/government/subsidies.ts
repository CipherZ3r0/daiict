import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import SubsidyRequest from "@/models/SubsidyRequest";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const subsidies = await SubsidyRequest.find().populate("producer");
      res.status(200).json(subsidies);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch subsidies" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
