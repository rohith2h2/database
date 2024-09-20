const cron = require('node-cron');
const { fetchAndStoreRSSFeeds } = require('./rss-handler');
const { fetchAndStoreAPIData } = require('./api-handler');
const { connectToDatabase } = require('./db-connection');

function startScheduler() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled data update');
    try {
      const db = await connectToDatabase();
      await fetchAndStoreRSSFeeds(db);
      await fetchAndStoreAPIData(db);
      console.log('Scheduled update complete');
    } catch (error) {
      console.error('Error in scheduled update:', error);
    }
  });
}

module.exports = { startScheduler };
