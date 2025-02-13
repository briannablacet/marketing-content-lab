// src/pages/api/writing-style.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { WritingStyle, WritingStyleResponse } from '../../types/WritingStyle';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WritingStyleResponse>
) {
  try {
    const client = await clientPromise;
    const db = client.db("marketmultiplier");
    const collection = db.collection<WritingStyle>("writingStyles");

    switch (req.method) {
      case 'GET':
        // For now, get the first writing style (we'll add user authentication later)
        const style = await collection.findOne({});
        return res.status(200).json({ success: true, data: style || undefined });

      case 'POST':
        // Create new writing style
        const newStyle: WritingStyle = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'temp-user' // We'll update this with real user ID later
        };
        
        const result = await collection.insertOne(newStyle);
        return res.status(201).json({ 
          success: true, 
          data: { ...newStyle, _id: result.insertedId }
        });

      case 'PUT':
        // Update existing writing style
        const { _id, ...updateData } = req.body;
        const updateResult = await collection.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { 
            $set: { 
              ...updateData,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        );
        
        return res.status(200).json({ 
          success: true, 
          data: updateResult.value || undefined
        });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ 
          success: false, 
          error: `Method ${req.method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Writing Style API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error' 
    });
  }
}