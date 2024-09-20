const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function identifyProblemDocument() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('api_data');

    const cursor = collection.find({});
    let count = 0;

    while (await cursor.hasNext()) {
      count++;
      try {
        const doc = await cursor.next();
        console.log(`Document ${count} (ID: ${doc._id}) processed successfully`);
      } catch (error) {
        console.error(`Error processing document ${count}:`, error);
        
        // Try to get the raw BSON data
        const rawDoc = await collection.findOne({ _id: cursor.current._id }, { raw: true });
        console.log('Raw document data:', rawDoc);

        // Attempt to identify problematic fields
        for (const [key, value] of Object.entries(rawDoc)) {
          try {
            JSON.stringify(value);
          } catch (fieldError) {
            console.error(`Problematic field: ${key}`);
          }
        }

        // Attempt to remove the problematic document
        try {
          await collection.deleteOne({ _id: cursor.current._id });
          console.log(`Removed problematic document with ID: ${cursor.current._id}`);
        } catch (deleteError) {
          console.error('Failed to remove problematic document:', deleteError);
        }

        break; // Stop after finding the first problematic document
      }
    }

    console.log(`Processed ${count} documents`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

identifyProblemDocument().catch(console.error);