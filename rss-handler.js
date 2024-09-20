
const Parser = require('rss-parser');
const parser = new Parser();
const { sanitizeData } = require('./utils');

async function fetchAndStoreRSSFeeds(db) {
  const collection = db.collection('rss_feeds');

  // List of RSS feed URLs from your document
const feedUrls = [
  // 'https://rss.app/feeds/tcPd7063EVs7eBuw.xml',  // Commented out due to 403 error
  // 'https://rss.app/feeds/nL30vBfDF0ObJumP.xml',  // Commented out due to 403 error
  'https://www.bing.com/search?format=RSS&q=valentine%27s%20day',
  'https://en.search.wordpress.com/?f=feed&q=valentine%27s%20day',
  'https://archive.org/services/collection-rss.php?query=description:valentine%27s%20day',
  'https://news.google.com/rss/search?q=valentine%27s+day&hl=en-US&gl=US&ceid=US:en',
  'https://hnrss.org/newest?q=valentine%27s%20day',
  'https://blawgsearch.justia.com/rss/search?mode=rss&l=20&s=0&query=valentine%27s%20day',
  'https://archive.org/services/collection-rss.php?query=description:valentine%27s%20day%20movies',
  'https://www.lovepop.com/collections/valentines-day-greeting-cards.atom',
  //'https://rss.app/feeds/tlwrRJA2qISZoWpi.xml',  // Commented out due to 403 error
  'https://www.bing.com/news/search?format=RSS&q=https://www.gifts.com/',
  //'https://rss.app/feeds/ROTszXaSZdIcb8Du.xml',  // Commented out due to 403 error
  'https://www.papelcouture.com/feed/',
  'https://screenrant.com/feed/db/movie/blue-is-the-warmest-color/',
  'https://rss.art19.com/doughboys',
  'https://www.dinneralovestory.com/category/general/rituals/feed/',
  'https://www.dmagazine.com/category/gift-guides/feed/',
  'https://www.coremagazines.com/category/lit/feed/',
  'https://www.joannesplace.ca/feed/rss2',
  'https://sparklersrus-com.3dcartstores.com/rss.asp?type=blog',
  'https://nashvilleguru.com/editorial_calendar/january/feed',
  // 'https://rss.app/feeds/1t4KbxIk3cz8sRSN.xml'  // Commented out due to 403 error
];

  for (const url of feedUrls) {
    try {
      console.log(`Fetching RSS feed: ${url}`);
      const feed = await parser.parseURL(url);
      
      const sanitizedFeed = sanitizeData({
        title: feed.title,
        description: feed.description,
        items: feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pub_date: new Date(item.pubDate),
          content: item.content
        }))
      });

      await collection.updateOne(
        { url: url },
        { 
          $set: {
            ...sanitizedFeed,
            last_updated: new Date()
          }
        },
        { upsert: true }
      );

      console.log(`Updated RSS feed: ${url}`);
    } catch (error) {
      console.error(`Error fetching/storing RSS feed ${url}:`, error);
    }
  }
}

module.exports = { fetchAndStoreRSSFeeds };
