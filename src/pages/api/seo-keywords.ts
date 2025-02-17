// File: src/pages/api/seo-keywords.ts

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

interface KeywordGroup {
  category: string;
  keywords: string[];
}

interface SeoKeywords {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  keywordGroups: KeywordGroup[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data?: SeoKeywords;
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
    const collection = db.collection("seoKeywords");

    switch (req.method) {
      case "POST":
        console.log('📝 Processing POST request...');
        
        const keywordData: SeoKeywords = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('💾 Attempting to save data:', keywordData);

        const result = await collection.insertOne(keywordData);
        console.log('✅ Data saved successfully:', result);
        
        return res.status(201).json({
          success: true,
          data: keywordData,
          message: "SEO keywords created successfully"
        });

      case "GET":
        console.log('🔍 Processing GET request...');
        const keywordInfo = await collection.findOne(
          {}, 
          { sort: { createdAt: -1 } }
        );

        if (!keywordInfo) {
          console.log('⚠️ No SEO keywords found');
          return res.status(404).json({
            success: false,
            message: "No SEO keywords found"
          });
        }

        console.log('✅ Found SEO keywords:', keywordInfo);
        return res.status(200).json({
          success: true,
          data: keywordInfo
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
            message: "SEO keywords not found"
          });
        }

        return res.status(200).json({
          success: true,
          data: updateResult,
          message: "SEO keywords updated successfully"
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