// src/pages/api/test-connection.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Get the default database

    // Check if the database connection is successful
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();

    res.status(200).json({
      success: true,
      message: "✅ MongoDB connection is working!",
      serverStatus,
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    res.status(500).json({ success: false, message: "❌ MongoDB connection failed", error });
  }
}
