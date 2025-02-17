// File: src/pages/api/competitor-analysis.ts

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

interface Competitor {
  name: string;
  description?: string;
  differentiators: string[];
}

interface CompetitorAnalysis {
  competitors: Competitor[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data?: CompetitorAnalysis;
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
    console.log('🔌 Attempting MongoDB connection...');
    const client = await clientPromise;
    console.log('✅ MongoDB connected successfully');

    const db = client.db("MarketMultiplier");
    const collection = db.collection("competitorAnalysis");

    switch (req.method) {
      case "POST":
        console.log('📝 Processing POST request...');
        
        const competitorData: CompetitorAnalysis = {
          competitors: req.body.competitors,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('💾 Attempting to save data:', competitorData);

        const result = await collection.insertOne(competitorData);
        console.log('✅ Data saved successfully:', result);
        
        return res.status(201).json({
          success: true,
          data: competitorData,
          message: "Competitor analysis created successfully"
        });

      case "GET":
        console.log('🔍 Processing GET request...');
        const competitorInfo = await collection.findOne(
          {}, 
          { sort: { createdAt: -1 } }
        );

        if (!competitorInfo) {
          console.log('⚠️ No competitor analysis found');
          return res.status(404).json({
            success: false,
            message: "No competitor analysis found"
          });
        }

        console.log('✅ Found competitor analysis:', competitorInfo);
        return res.status(200).json({
          success: true,
          data: competitorInfo
        });

      case "PUT":
        console.log('📝 Processing PUT request...');
        const updateData = {
          ...req.body,
          updatedAt: new Date()
        };

        const updateResult = await collection.findOneAndUpdate(
          { _id: req.body._id },
          { $set: updateData },
          { returnDocument: "after" }
        );

        if (!updateResult) {
          return res.status(404).json({
            success: false,
            message: "Competitor analysis not found"
          });
        }

        return res.status(200).json({
          success: true,
          data: updateResult,
          message: "Competitor analysis updated successfully"
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