import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your Mongo URI to your environment's secrets as MONGODB_URI");
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the client is not recreated on every hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a MongoClient promise. By doing this in a separate module, the client can be shared across functions.
export default clientPromise;


