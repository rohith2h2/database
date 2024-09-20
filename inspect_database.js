const { connectToDatabase, closeDatabaseConnection } = require('./db-connection');

async function inspectDatabase() {
  let db;
  try {
    db = await connectToDatabase();
    const collection = db.collection('api_data');
    
    const documents = await collection.find({}).toArray();
    
    console.log(`Total documents in api_data collection: ${documents.length}`);
    
    documents.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log(`API Endpoint: ${doc.api_endpoint}`);
      console.log(`Last Updated: ${doc.last_updated}`);
      console.log('Data:', JSON.stringify(doc.data, null, 2).slice(0, 200) + '...'); // Print first 200 characters of data
    });

  } catch (error) {
    console.error('Error inspecting database:', error);
  } finally {
    if (db) await closeDatabaseConnection();
  }
}

inspectDatabase().then(() => console.log('Database inspection complete'));