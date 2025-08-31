import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { walletAddress } = req.body;
      // TODO: Integrate with blockchain later
      console.log("Connected wallet:", walletAddress);
      res.status(200).json({ success: true, walletAddress });
    } catch (err) {
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
