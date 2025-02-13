// pages/api/test-connection.ts
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Log environment check
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    
    // Mask password in URI for safe logging
    const uri = process.env.MONGODB_URI || '';
    const maskedUri = uri.replace(
      /(?<=mongodb\+srv:\/\/[^:]+:)[^@]+(?=@)/,
      '****'
    );
    console.log('Connecting with URI:', maskedUri);

    // Attempt connection
    const client = await clientPromise;
    console.log('Client connected');
    
    const db = client.db("marketmultiplier");
    console.log('Database selected');
    
    // Test command
    await db.command({ ping: 1 });
    console.log('Ping successful');

    res.status(200).json({ 
      status: 'Connected successfully to MongoDB!',
      environment: process.env.NODE_ENV,
      uriExists: !!process.env.MONGODB_URI
    });
  } catch (e) {
    console.error('Detailed error:', e);
    res.status(500).json({ 
      error: 'Failed to connect to MongoDB',
      details: e instanceof Error ? e.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      uriExists: !!process.env.MONGODB_URI
    });
  }
}