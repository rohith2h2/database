const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function exportValidDocuments() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(process.env.DB_NAME);
    const sourceCollection = db.collection('api_data');
    const targetCollection = db.collection('api_data_clean');

    // Ensure the target collection is empty
    await targetCollection.deleteMany({});

    const cursor = sourceCollection.find({});
    let totalDocuments = 0;
    let validDocuments = 0;

    while (true) {
      try {
        const doc = await cursor.next();
        if (doc === null) {
          break; // End of the collection
        }
        totalDocuments++;
        await targetCollection.insertOne(doc);
        validDocuments++;
        console.log(`Exported document ${totalDocuments} successfully`);
      } catch (error) {
        console.error(`Error processing document ${totalDocuments + 1}:`, error);
      }
    }

    console.log(`Processed ${totalDocuments} documents.`);
    console.log(`Exported ${validDocuments} valid documents to api_data_clean collection.`);

    // Rename collections
    await db.renameCollection('api_data', 'api_data_old');
    await db.renameCollection('api_data_clean', 'api_data');

    console.log('Collection renamed. Old data is in api_data_old, cleaned data is in api_data.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

exportValidDocuments().catch(console.error);