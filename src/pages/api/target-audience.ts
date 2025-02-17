// File: src/pages/api/target-audience.ts

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

interface Persona {
  name: string;
  description: string;
  problems: string[];
}

interface TargetAudience {
  personas: Persona[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data?: TargetAudience;
  message?: string;
  error?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  console.log('📥 Received request:', {
    method: req.method,
    body: req.body,
    query: req.query
  });

  try {
    // Log MongoDB connection attempt
    console.log('🔌 Attempting MongoDB connection...');
    const client = await clientPromise;
    console.log('✅ MongoDB connected successfully');

    const db = client.db("MarketMultiplier");
    const collection = db.collection("targetAudience");

    switch (req.method) {
      case "POST":
        console.log('📝 Processing POST request...');
        
        // Log the data we're about to save
        const audienceData: TargetAudience = {
          personas: req.body.personas,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('💾 Attempting to save data:', audienceData);

        // Attempt to insert the data
        const result = await collection.insertOne(audienceData);
        console.log('✅ Data saved successfully:', result);
        
        return res.status(201).json({
          success: true,
          data: audienceData,
          message: "Target audience information created successfully"
        });

      case "GET":
        console.log('🔍 Processing GET request...');
        const audienceInfo = await collection.findOne(
          {}, 
          { sort: { createdAt: -1 } }
        );

        if (!audienceInfo) {
          console.log('⚠️ No target audience information found');
          return res.status(404).json({
            success: false,
            message: "No target audience information found"
          });
        }

        console.log('✅ Found target audience information:', audienceInfo);
        return res.status(200).json({
          success: true,
          data: audienceInfo
        });

      default:
        console.log('⚠️ Invalid method:', req.method);
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}