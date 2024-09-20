const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client.db(process.env.DB_NAME);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function closeDatabaseConnection() {
  await client.close();
  console.log("Database connection closed");
}

module.exports = { connectToDatabase, closeDatabaseConnection }
