const puppeteer = require('puppeteer');
const readline = require('readline');

// Create interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user for search terms
rl.question('Enter search terms: ', async (searchTerms) => {
  // Close the readline interface
  rl.close();

  // Launch a headless browser
  const browser = await puppeteer.launch({ headless: "new" });

  // Open a new page
  const page = await browser.newPage();

  // Construct the search URL
  const searchUrl = `https://www.mightyape.co.nz/Search?q=${encodeURIComponent(searchTerms)}`;

  // Navigate to the search results page
  await page.goto(searchUrl);

  // Extract search result details
  const results = await page.evaluate(() => {
    const products = Array.from(document.querySelectorAll('.product-list .product')); // Select all products
    return products.map(product => {
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
    });
  });

  console.log('Search results:');
  console.log(results);

  // Close the browser
  await browser.close();
});
