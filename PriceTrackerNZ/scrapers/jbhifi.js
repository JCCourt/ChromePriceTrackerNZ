const puppeteer = require('puppeteer');

async function scrapeJBHiFi(searchTerms) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    console.log('Navigating to JB Hi-Fi search page...');
    await page.goto(`https://www.jbhifi.co.nz/search?q=${encodeURIComponent(searchTerms)}`, { waitUntil: 'domcontentloaded' });
  
    try {
        console.log('JB Hi-Fi search page loaded successfully.');
    
        console.log('Entering search terms...');
        await page.type('#search-layover-container > div > div.search-container > div > div.search-bar > form > input', searchTerms);
        console.log('Search terms entered.');
    
        console.log('Pressing Enter key...');
        await page.keyboard.press('Enter');
        console.log('Enter key pressed.');
    
        console.log('Waiting for search results...');
        await page.waitForSelector('#search-results-container > div > div > div:nth-child(4) > div.search-results-loop > div:nth-child(1) > div._10ipotx0._10ipotx4 > a > div._10ipotx1t._10ipotx1u > div._10ipotx7._10ipotx7', { timeout: 10000 });
        console.log('Search results loaded successfully.');
    
        // Extract search result details
        const jbHiFiData = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('div.search-results-loop > div')); // Select all product tiles
            return products.map(product => {
                const titleElement = product.querySelector('._10ipotx7'); // Get product title element
                const title = titleElement ? titleElement.textContent.trim() : '';
    
                const priceElement = product.querySelector('.PriceFont_fontStyle__w0cm2q1.PriceTag_actual__1eb7mu9q.PriceTag_actual_variant_small__1eb7mu9s'); // Get price element
                const price = priceElement ? priceElement.textContent.trim() : ''; // Extract price
    
                const imgElement = product.querySelector('img._10ipotxd._10ipotxg'); // Get product image element
                const imgSrc = imgElement ? imgElement.src : ''; // Extract image source
    
                return { title, price, imgSrc }; // Return title, price, image source,
            });
        });
    
        await browser.close();
        console.log('Data extracted successfully.');
        console.log('Number of results:', jbHiFiData.length);
        console.log('-------------------')
        return jbHiFiData;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        throw error;
    }
}

module.exports = scrapeJBHiFi;
