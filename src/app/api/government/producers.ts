import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Producer from "@/models/Producer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const producers = await Producer.find();
      res.status(200).json(producers);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch producers" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
