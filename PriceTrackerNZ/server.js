const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3001; // Change port number if needed

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define route handler for the root URL ("/")
app.get('/', (req, res) => {
  // Serve the search.html file when the root URL is accessed
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Endpoint to handle scraping requests
app.get('/scrape', async (req, res) => {
  const searchQuery = req.query.search;

  console.log('Received scraping request for:', searchQuery);

  try {
    // Your scraping logic using Puppeteer
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ headless: "new" }); // Set headless to true for production
    console.log('Puppeteer launched successfully.');

    console.log('Opening a new page...');
    const page = await browser.newPage();
    console.log('New page opened successfully.');

    console.log('Navigating to search URL:', searchQuery);
    const searchUrl = `https://www.mightyape.co.nz/search?q=${encodeURIComponent(searchQuery)}`;
    await page.goto(searchUrl);
    console.log('Navigation complete.');

    // Extract data from the page
    console.log('Extracting data from the page...');
    const data = await page.evaluate(() => {
      // Define an array to store the scraped data
      const scrapedData = [];

      // Example: Scraping titles of search results
      const titles = document.querySelectorAll('.product-list .product .title');
      titles.forEach(title => {
        scrapedData.push({
          title: title.textContent.trim()
        });
      });

      // Example: Scraping prices of search results
      const prices = document.querySelectorAll('.product-list .product .price');
      prices.forEach((price, index) => {
        // Assuming prices and titles are matched by index
        scrapedData[index].price = price.textContent.trim();
      });

      // Example: Scraping image URLs of search results
      const images = document.querySelectorAll('.product-list .product img');
      images.forEach((image, index) => {
        // Assuming images and titles are matched by index
        scrapedData[index].imageUrl = image.src;
      });

      return scrapedData;
    });

    await browser.close();

    // Send the scraped data as JSON response
    console.log('Scraping complete. Sending data as JSON response.');
    res.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
