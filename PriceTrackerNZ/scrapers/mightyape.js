const puppeteer = require('puppeteer');

async function scrapeMightyApe(searchTerms) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  console.log('Navigating to MightyApe search page...');
  await page.goto(`https://www.mightyape.co.nz/Search?q=${encodeURIComponent(searchTerms)}`, { waitUntil: 'domcontentloaded' });

  try {
    const searchResults = await waitForSelectorWithTimeout(page, '.product-list .product', 10000);
    console.log('Search results loaded successfully.');
    
    const productElement = await page.$('.product-list .product');
    console.log('Found 1 result.');

    // Extract search result details
    const result = await page.evaluate(product => {
      const titleElement = product.querySelector('.title'); // Get product title element
      const title = titleElement ? titleElement.textContent.trim() : ''; // Extract title

      // Get price dollars using XPath
      const priceDollarsElement = product.querySelector('span[class*="dollars"]');
      const priceDollars = priceDollarsElement ? priceDollarsElement.textContent.trim() : '';

      // Get price cents using XPath
      const priceCentsElement = product.querySelector('span[class*="cents"]');
      const priceCents = priceCentsElement ? priceCentsElement.textContent.trim() : '';

      // Combine dollars and cents into price
      const price = `${priceDollars}.${priceCents}`.replace('.', ''); // Remove extra '.' character

      const imgElement = product.querySelector('img'); // Get product image element
      const imgSrc = imgElement ? imgElement.src : ''; // Extract image source

      return { title, price, imgSrc }; // Return title, price, and image source
    }, productElement);

    await browser.close();
    console.log(`Displayed 1 result.`);
    console.log('--------------------');
    return [result];
  } catch (error) {
    console.error('Error waiting for selector:', error);
    await browser.close();
    return { error: 'Error waiting for selector' };
  }
}

async function waitForSelectorWithTimeout(page, selector, timeout) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    throw new Error(`Waiting for selector "${selector}" failed: ${error}`);
  }
}

module.exports = scrapeMightyApe;
