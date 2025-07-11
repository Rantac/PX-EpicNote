import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:lRM61QNHdwRa4rGi@coudmongo.rofyulw.mongodb.net/?retryWrites=true&w=majority&appName=CoudMongo";
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const database = client.db('analysisDB'); // Replace 'analysisDB' with your database name
    const collection = database.collection('weeklyAnalysis'); // Replace 'weeklyAnalysis' with your collection name

    if (req.method === 'POST') {
      const analysisData = req.body;
      const result = await collection.insertOne(analysisData);
      res.status(201).json({ message: 'Analysis data saved successfully', insertedId: result.insertedId });
    } else if (req.method === 'GET') {
      const analysisData = await collection.find({}).toArray();
      res.status(200).json(analysisData);
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB or performing database operation:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}