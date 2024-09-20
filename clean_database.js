const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function cleanDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('api_data');

    const cursor = collection.find({});
    let totalDocuments = 0;
    let removedDocuments = 0;

    while (await cursor.hasNext()) {
      totalDocuments++;
      try {
        const doc = await cursor.next();
        // If we can access the document without error, it's valid
        console.log(`Valid document found: ${doc._id}`);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Invalid UTF-8 string')) {
          console.log(`Invalid document found. Attempting to remove...`);
          try {
            await collection.deleteOne({ _id: cursor.current._id });
            removedDocuments++;
            console.log(`Removed invalid document with _id: ${cursor.current._id}`);
          } catch (deleteError) {
            console.error(`Error removing document: ${deleteError}`);
          }
        } else {
          console.error(`Unexpected error: ${error}`);
        }
      }
    }

    console.log(`Processed ${totalDocuments} documents.`);
    console.log(`Removed ${removedDocuments} invalid documents.`);

  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

cleanDatabase().then(() => console.log('Database cleaning complete'));