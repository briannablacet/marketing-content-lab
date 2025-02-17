// src/pages/api/product-info.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

// Define TypeScript interfaces for our data structure
interface ProductInfo {
  name: string;
  type: string;
  valueProposition: string;
  keyBenefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data?: ProductInfo;
  message?: string;
  error?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const client = await clientPromise;
    const db = client.db("MarketMultiplier");
    const collection = db.collection("productInfo");

    switch (req.method) {
      case "POST":
        // Create new product info
        const productData: ProductInfo = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await collection.insertOne(productData);
        
        return res.status(201).json({
          success: true,
          data: productData,
          message: "Product information created successfully"
        });

      case "GET":
        // Retrieve latest product info
        const productInfo = await collection.findOne(
          {}, // Empty filter to get the latest entry
          { sort: { createdAt: -1 } }
        );

        if (!productInfo) {
          return res.status(404).json({
            success: false,
            message: "No product information found"
          });
        }

        return res.status(200).json({
          success: true,
          data: productInfo
        });

      case "PUT":
        // Update existing product info
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
            message: "Product information not found"
          });
        }

        return res.status(200).json({
          success: true,
          data: updateResult,
          message: "Product information updated successfully"
        });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error
    });
  }
}