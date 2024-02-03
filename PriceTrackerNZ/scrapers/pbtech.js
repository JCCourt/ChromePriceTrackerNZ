const puppeteer = require('puppeteer');

async function scrapePBtech(searchTerms) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to PB Tech search page...');
    await page.goto(`https://www.pbtech.co.nz/search?sf=${encodeURIComponent(searchTerms)}`, { waitUntil: 'domcontentloaded' });
    console.log('PB Tech search page loaded successfully.');

    console.log('Waiting for product list container...');
    await page.waitForSelector('.products-list-wrapper'); // Use a CSS selector instead of an XPath selector
    console.log('Product list container loaded.');

    console.log('Extracting data from the product list...');
    const data = await page.evaluate(() => {
      const products = Array.from(document.querySelectorAll('.product-list-item a')); // Select all the product elements

      return products.map(product => { // Loop over each product element
        const title = product.querySelector('h2').textContent.trim(); // Get the product title
        const imageUrl = product.querySelector('img').src; // Get the product image URL

        return { title, imageUrl }; // Return an object with information for each product
      });
    });
    console.log('Data extracted successfully.');

    await browser.close();
    console.log('Browser closed.');
    console.log('---------------');

    return data;
  } catch (error) {
    console.error('Error during scraping:', error);
    await browser.close();
    console.log('Browser closed due to error.');

    return [];
  }
}

module.exports = scrapePBtech;
