const puppeteer = require('puppeteer');

async function scrapePBtech(searchTerms) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    console.log('Navigating to PB Tech search page...');
    await page.goto(`https://www.pbtech.co.nz/search?sf=${encodeURIComponent(searchTerms)}`, { waitUntil: 'domcontentloaded' });
    console.log('PB Tech search page loaded successfully.');

    console.log('Waiting for product list container...');
    await page.waitForXPath('/html/body/div[6]/div[2]/div[2]/div/div[2]');
    console.log('Product list container loaded.');

    console.log('Extracting data from the product list...');
    const data = await page.evaluate(() => {
      const productElement = document.querySelector('.product-list-item a');

      if (!productElement) {
        return []; // Return an empty array if no product is found
      }

      const title = productElement.querySelector('h2').textContent.trim();
      const imageUrl = productElement.querySelector('img').src;

      return [{ title, imageUrl }]; // Return an array with information for the first product
    });
    console.log('Data extracted successfully.');

    await browser.close();
    console.log('Browser closed.');
    console.log('---------------')

    return data;
  } catch (error) {
    console.error('Error during scraping:', error);
    await browser.close();
    console.log('Browser closed due to error.');

    return [];
  }
}

module.exports = scrapePBtech;
