const express = require('express');
const axios = require('axios');

const { connectToDatabase, closeDatabaseConnection } = require('./db-connection');
const { startScheduler } = require('./scheduler');
const { fetchAndStoreRSSFeeds } = require('./rss-handler');
const { fetchAndStoreAPIData } = require('./api-handler');
const { sanitizeData } = require('./utils');
const { BSONError } = require('bson');

const app = express();
app.use(express.json());

let db;

// Start the scheduler
startScheduler();

app.get('/rss-feeds', async (req, res) => {
  try {
    if (!db) db = await connectToDatabase();
    const feeds = await db.collection('rss_feeds').find({}).toArray();
    const sanitizedFeeds = feeds.map(feed => sanitizeData(feed));
    console.log(`Retrieved ${sanitizedFeeds.length} RSS feeds`);
    res.json(sanitizedFeeds);
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch RSS feeds' });
  }
});

app.get('/api-data', async (req, res) => {
  try {
    if (!db) db = await connectToDatabase();
    const apiData = await db.collection('api_data').find({}).toArray();
    const sanitizedApiData = apiData.map(item => sanitizeData(item));
    console.log(`Retrieved ${sanitizedApiData.length} API data entries`);
    res.json(sanitizedApiData);
  } catch (error) {
    console.error('Error fetching API data:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch API data' });
  }
});

// app.get('/api-data', async (req, res) => {
//   try {
//     const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/Hindu_calendar');
//     const sanitizedData = sanitizeData(response.data);
//     console.log('Retrieved API data for Hindu calendar');
//     res.json(sanitizedData);
//   } catch (error) {
//     console.error('Error fetching API data:', error);
//     res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch API data' });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    db = await connectToDatabase();
    console.log('Fetching initial RSS feeds...');
    await fetchAndStoreRSSFeeds(db);
    console.log('Fetching initial API data...');
    await fetchAndStoreAPIData(db);
    console.log('Initial data fetch complete');
  } catch (error) {
    console.error('Error during initial data fetch:', error);
  }
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully');
  await closeDatabaseConnection();
  process.exit(0);
});


// const express = require('express');
// const { connectToDatabase, closeDatabaseConnection } = require('./db-connection');
// const axios = require('axios');
// const { sanitizeData } = require('./utils');
// const { BSONError } = require('bson');

// const app = express();
// app.use(express.json());

// let db;

// app.get('/api-data', async (req, res) => {
//   try {
//     if (!db) db = await connectToDatabase();
//     const apiData = await db.collection('api_data').find({}).toArray();
//     const sanitizedApiData = apiData.map(item => sanitizeData(item));
//     console.log(`Retrieved ${sanitizedApiData.length} API data entries from database`);
//     res.json(sanitizedApiData);
//   } catch (error) {
//     console.error('Error fetching API data from database:', error);
    
//     // If it's a BSON error, try fetching directly from the API
//     if (error instanceof BSONError || error.name === 'BSONError') {
//       try {
//         const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/Hindu_calendar');
//         const sanitizedData = sanitizeData(response.data);
//         console.log('Retrieved API data directly from Wikipedia');
//         res.json([sanitizedData]); // Wrap in array to match expected format
//       } catch (apiError) {
//         console.error('Error fetching data directly from API:', apiError);
//         res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch API data' });
//       }
//     } else {
//       res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch API data' });
//     }
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
  
//   try {
//     db = await connectToDatabase();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to database:', error);
//   }
// });

// process.on('SIGINT', async () => {
//   console.log('Shutting down gracefully');
//   await closeDatabaseConnection();
//   process.exit(0);
// });



