const axios = require('axios');
const { sanitizeData } = require('./utils');

async function fetchAndStoreAPIData(db) {
  const collection = db.collection('api_data');

  // List of API endpoints from your document
  const apiEndpoints = [
    'https://agen-assets.ftstatic.com/display/7892724/4748274.json',
    'https://script.crazyegg.com/pages/data-scripts/0032/1410/site/www.hinduamerican.org.json?t=1',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Hindu_calendar',
    'https://optimise.net/?k=0&d=chinesenewyear.net&t=desktop&c=US&r=1',
    'https://pb-rtd.ccgateway.net/v1.0/realtime/4d97a662ad?profile_id=704045cc-62c5-400b-9159-2f474f4ae0c3&url=https%253A%252F%252Fchinesenewyear.net%252F&context=true&audience=true&deal_ids=true&custom_taxonomy=true',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Lunar_New_Year',
    'https://bellevuecollection.com/wp-json/business_hrs/v1/data/38867',
    'https://www.history.com/editorial/api/post?include=21864%2C31931%2C42534&type=story&orderby=include&locale=en',
    'https://script.crazyegg.com/pages/data-scripts/0013/1464/site/www.history.com.json?t=1',
    'https://dpm.demdex.net/id?d_visid_ver=4.4.1&d_fieldgroup=MC&d_rtbd=json&d_ver=2&d_orgid=10D31225525FF5790A490D4D%40AdobeOrg&d_nsid=0&ts=1725996894560',
    'https://www.history.com/editorial/api/post?slug=first-mardi-gras-mobile-alabama-new-orleans&type=story&locale=en',
    'https://www.history.com/editorial/api/post?slug=from-king-cake-to-zulu-coconuts-the-history-of-6-mardi-gras-traditions&type=story&locale=en',
    'https://www.history.com/editorial/api/related/stories/33377?amount=6&nonce=&locale=en',
    'https://www.history.com/editorial/api/related/topics/11711?amount=6&nonce=&locale=en',
    'https://www.britannica.com/topic-content/topic/446761',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Argentina',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Australia',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Irish_diaspora',
    'https://en.wikipedia.org/api/rest_v1/page/summary/South_Africa',
    'https://www.history.com/editorial/api/post?slug=halloween-timeline&type=story&locale=en',
    'https://www.history.com/editorial/api/post?include=33527%2C24263%2C24050&type=story&orderby=include&locale=en',
    'https://www.history.com/editorial/api/post?include=64786%2C44160%2C33771&type=story&orderby=include&locale=en',
    'https://www.history.com/editorial/api/post?slug=eid-al-fitr&type=topic&locale=en',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Eid_al-Fitr',
    'https://www.history.com/editorial/api/post?slug=eid-al-adha&type=topic&locale=en',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Eid_al-Adha',
    'https://www.history.com/editorial/api/post?slug=hanukkah&type=topic&locale=en',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Hanukkah',
    'https://www.history.com/editorial/api/post?slug=cinco-de-mayo&type=topic&locale=en',
    'https://www.history.com/editorial/api/post?include=37210%2C38315&type=story&orderby=include&locale=en',
    'https://www.history.com/editorial/api/post?include=6385&type=topic&orderby=include&locale=en',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Cinco_de_Mayo',
    'https://www.history.com/editorial/api/post?include=6043%2C2392%2C4624&type=topic&orderby=include&locale=en',
    'https://www.history.com/editorial/api/post?include=31919%2C39008%2C38664&type=story&orderby=include&locale=en',
    // // 'https://www.history.com/editorial/api/post?include=41596%2C36795%2C26474&type=story&orderby=include&locale=en',
    'https://www.history.com/editorial/api/post?include=30236%2C38571%2C31919&type=story&orderby=include&locale=en',
    'https://en.wikipedia.org/api/rest_v1/page/summary/Christmastide',
    'https://www.history.com/editorial/api/related/stories/36795?amount=6&nonce=&locale=en',
    'https://www.history.com/editorial/api/post?include=30236%2C38571%2C31919&type=story&orderby=include&locale=en',
    'https://www.history.com/editorial/api/related/topics/10155?amount=6&nonce=&locale=en',
    'https://www.history.com/editorial/api/post?include=27988%2C21787%2C37073&type=story&orderby=include&locale=en',
    'https://www.history.com/editorial/api/post?include=31434%2C35182%2C34605&type=story&orderby=include&locale=en'
  ];

  for (const endpoint of apiEndpoints) {
    try {
      console.log(`Fetching API data: ${endpoint}`);
      const response = await axios.get(endpoint);
      
      const sanitizedData = sanitizeData(response.data);

      await collection.updateOne(
        { api_endpoint: endpoint },
        { 
          $set: {
            data: sanitizedData,
            last_updated: new Date()
          }
        },
        { upsert: true }
      );

      console.log(`Updated API data: ${endpoint}`);
    } catch (error) {
      console.error(`Error fetching/storing API data ${endpoint}:`, error);
    }
  }
}

module.exports = { fetchAndStoreAPIData };
