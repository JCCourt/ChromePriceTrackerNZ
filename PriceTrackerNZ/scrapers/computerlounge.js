const puppeteer = require('puppeteer');

async function scrapeComputerLounge(searchTerms) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
  
    try {
        console.log('Navigating to Computer Lounge Search Page');
        await page.goto(`https://www.computerlounge.co.nz/ProductCatList.aspx?q=${encodeURIComponent(searchTerms)}`, { waitUntil: 'domcontentloaded' });
        console.log('Computer Lounge Search Page loaded successfully.');
        
        console.log('Entering search terms...');
        await page.type('#Search > div.input-group', searchTerms);
        console.log('Search terms entered.');
    
        console.log('Pressing Enter key...');
        await page.keyboard.press('Enter');
        console.log('Enter key pressed.');
    
        console.log('Waiting for search results...');
        await page.waitForSelector('#ProductListing > div > div.js-productContent > div.col-xs-12.col-sm-9.col-md-9.col-lg-9.productGridWrapper > div.frow.js-productcontentview.productContentView', { timeout: 10000 });
        console.log('Search results loaded successfully.');
    
        // Extract search result details
        const computerloungeData = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('#ProductListing > div > div.js-productContent > div.col-xs-12.col-sm-9.col-md-9.col-lg-9.productGridWrapper > div.frow.js-productcontentview.productContentView')); // Select all product tiles
            return products.map(product => {
                const titleElement = product.querySelector('#ProductListing > div > div.js-productContent > div.col-xs-12.col-sm-9.col-md-9.col-lg-9.productGridWrapper > div.frow.js-productcontentview.productContentView > article:nth-child(1) > div.productContentWrapper > div.productDetailWrapper > div > div.productTitle > a'); // Get product title element
                const title = titleElement ? titleElement.textContent.trim() : '';
    
                // Get price dollars using XPath
                const priceDollarsElement = product.querySelector('#ProductListing > div > div.js-productContent > div.col-xs-12.col-sm-9.col-md-9.col-lg-9.productGridWrapper > div.frow.js-productcontentview.productContentView > article:nth-child(1) > div.productContentWrapper > div.price > div.priceHolder > div > span.priceInteger');
                const priceDollars = priceDollarsElement ? priceDollarsElement.textContent.trim() : '';

                // Get price cents using XPath
                const priceCentsElement = product.querySelector('#ProductListing > div > div.js-productContent > div.col-xs-12.col-sm-9.col-md-9.col-lg-9.productGridWrapper > div.frow.js-productcontentview.productContentView > article:nth-child(1) > div.productContentWrapper > div.price > div.priceHolder > div > span.priceFraction');
                const priceCents = priceCentsElement ? priceCentsElement.textContent.trim() : '';
    
                // Combine dollars and cents into price
                const price = `${priceDollars}.${priceCents}`.replace('.', ''); // Remove extra '.' character

                const imgElement = product.querySelector('#ProductListing > div > div.js-productContent > div.col-xs-12.col-sm-9.col-md-9.col-lg-9.productGridWrapper > div.frow.js-productcontentview.productContentView > article:nth-child(1) > div.imageContainer > a > img'); // Get product image element
                const imgSrc = imgElement ? imgElement.src : ''; // Extract image source
    
                return { title, price, imgSrc }; // Return title, price, image source,
            });
        });
    
        await browser.close();
        console.log('Data extracted successfully.');
        console.log('Number of results:', computerloungeData.length);
        console.log('-------------------')
        return computerloungeData;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        throw error;
    }
}

module.exports = scrapeComputerLounge;