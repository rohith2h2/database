const { connectToDatabase, closeDatabaseConnection } = require('./db-connection');
const { sanitizeData } = require('./utils');

async function sanitizeDatabase() {
  let db;
  try {
    db = await connectToDatabase();
    const apiCollection = db.collection('api_data');
    const rssCollection = db.collection('rss_feeds');

    // Sanitize API data
    const apiCursor = apiCollection.find({});
    let apiCount = 0;
    while (await apiCursor.hasNext()) {
      const doc = await apiCursor.next();
      const sanitizedDoc = sanitizeData(doc);
      await apiCollection.updateOne({ _id: doc._id }, { $set: sanitizedDoc }, { bypassDocumentValidation: true });
      apiCount++;
    }
    console.log(`Sanitized ${apiCount} API data documents`);

    // Sanitize RSS feeds
    const rssCursor = rssCollection.find({});
    let rssCount = 0;
    while (await rssCursor.hasNext()) {
      const doc = await rssCursor.next();
      const sanitizedDoc = sanitizeData(doc);
      await rssCollection.updateOne({ _id: doc._id }, { $set: sanitizedDoc }, { bypassDocumentValidation: true });
      rssCount++;
    }
    console.log(`Sanitized ${rssCount} RSS feed documents`);

  } catch (error) {
    console.error('Error sanitizing database:', error);
  } finally {
    if (db) await closeDatabaseConnection();
  }
}

sanitizeDatabase().then(() => console.log('Database sanitization complete'));