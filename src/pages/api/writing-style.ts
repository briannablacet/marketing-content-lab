// src/pages/api/writing-style.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("MarketMultiplier"); // Use the exact database name
    const styles = await db.collection("writingStyles").find({}).toArray();

    res.status(200).json({ success: true, styles });
  } catch (error) {
    console.error("❌ Error fetching writing styles:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve writing styles", error });
  }
}
