const express = require('express');
const path = require('path');
const scrapeMightyApe = require('./scrapers/mightyape');
const scrapeJBHiFi = require('./scrapers/jbhifi');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

app.get('/scrape', async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    console.log(`Received scraping request for: ${search}`);
    const mightyApeData = await scrapeMightyApe(search);
    const jbHiFiData = await scrapeJBHiFi(search);
    
    const data = [];
    if (mightyApeData.length > 0) {
      data.push(mightyApeData[0]); // Add the first Mighty Ape result
    }
    if (jbHiFiData.length > 0) {
      data.push(jbHiFiData[0]); // Add the first JB Hi-Fi result
    }

    res.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
