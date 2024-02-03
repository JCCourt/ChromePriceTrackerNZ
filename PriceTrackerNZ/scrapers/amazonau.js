const puppeteer = require('puppeteer');

async function scrapeAmazonau(searchTerms) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('Navigating to Amazon Australia search page...');
    await page.goto(`https://www.amazon.com.au/s?k=${encodeURIComponent(searchTerms)}`, { waitUntil: 'domcontentloaded' });    

    console.log('Entering search terms...');
    await page.type('#twotabsearchtextbox', searchTerms);
    console.log('Search terms entered.');
    
    console.log('Waiting for search results...');
    await page.waitForSelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section', { timeout: 10000 });
    console.log('Search results loaded successfully.');  
    
    // Extract search result details
    const amazonauData = await page.evaluate(() => {
        const products = Array.from(document.querySelectorAll('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section')); // Select all product tiles
        
        const data = products.map(product => {
            const titleElement = product.querySelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a > span'); // Get product title element
            const title = titleElement ? titleElement.textContent.trim() : '';
    
            // Get price dollars using XPath
            const priceDollarsElement = product.querySelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > div:nth-child(1) > a > span > span:nth-child(2) > span.a-price-whole');
            const priceDollars = priceDollarsElement ? priceDollarsElement.textContent.trim() : '';
    
            // Get price cents using XPath
            const priceCentsElement = product.querySelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > div:nth-child(1) > a > span > span:nth-child(2) > span.a-price-fraction');
            const priceCents = priceCentsElement ? priceCentsElement.textContent.trim() : '';
    
            const price = parseFloat(`${priceDollars}.${priceCents}`.replace('.', '')) * 1.08;
            const roundedPrice = price.toFixed(2); // Limit to two decimal points
    
            const imgElement = product.querySelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.s-product-image-container.aok-relative.s-text-center.s-image-overlay-grey.puis-image-overlay-grey.s-padding-left-small.s-padding-right-small.puis-spacing-small.s-height-equalized.puis.puis-v1s9ddn432to7l1yimuv43pqlfg > span > a > div > img'); // Get product image element
            const imgSrc = imgElement ? imgElement.src : ''; // Extract image source
    
            return { title, roundedPrice, imgSrc }; // Return title, price, image source,
        });
    
        return data;
    });
    
    await browser.close();
    console.log(`Displayed ${amazonauData.length} results.`);
    console.log('--------------------');
    return amazonauData
};

module.exports = scrapeAmazonau;
