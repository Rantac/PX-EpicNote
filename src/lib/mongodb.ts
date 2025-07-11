import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Log the URI to help with debugging deployment issues.
console.log(`MongoDB URI from env: "${uri}"`);

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // This error is thrown if the MONGODB_URI environment variable is not set.
  throw new Error('Please add your Mongo URI to your environment's secrets as MONGODB_URI');
}

// Check if the URI is valid before attempting to connect
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  throw new Error(`Invalid MongoDB URI: It does not start with 'mongodb://' or 'mongodb+srv://'. Received: "${uri}"`);
}


if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the client is not recreated on every hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongo_client_promise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a MongoClient promise. By doing this in a separate module, the client can be shared across functions.
export default clientPromise;

