import mongoose, { Types, LeanDocument } from 'mongoose';

type ConnectionProps = {
  isConnected?: number | boolean;
};

export interface IDocument {
  _id: Types.ObjectId | string;
  __v: number;
  createdAt: EpochTimeStamp | string;
  updatedAt: EpochTimeStamp | string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  stockCount: number;
  description: string;
}

const connection: ConnectionProps = {};

async function connect() {
  if (connection.isConnected) {
    console.log('DB: Already connected.');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('DB: Using previous connection.');
      return;
    }
    await mongoose.disconnect();
  }
  if (process.env.DATABASE_URL) {
    const db: any = await mongoose.connect(process.env.DATABASE_URL);
    console.log('DB: New connection created.');
    connection.isConnected = db.connections[0].readyState;
  } else {
    throw new Error('Missing credentials.');
  }
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      // Disconnect after each request to release server resource
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      // Persist connection in dev mode
      console.log(
        'DB: Not disconnected - connection persisted for development.'
      );
    }
  }
}

// Convert id (ObjectId) and timestamps to strings
function formatDocValues(document: LeanDocument<IDocument>) {
  let doc = document;
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, formatDocValues };
export default db;
