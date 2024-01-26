const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt the user for the URL
rl.question('Enter the product URL: ', (userInputUrl) => {
    // Close the readline interface
    rl.close();
    // Call the scrapeProduct function with the user input URL
    scrapeProduct(userInputUrl);
});

// Scrape function
async function scrapeProduct(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    //Title
    const [el] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/header/div/div[1]/h1');
    if (el) {
        const titleHandle = await el.getProperty('textContent');
        const title = await titleHandle.jsonValue();
        console.log('Title:', title);
    } else {
        console.error('Title element not found');
    }

    //IMG
    const [el2] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/div[1]/ul/li[1]/span/a/img');
    if (el2) {
        const imgUrlHandle = await el2.getProperty('src');
        const imgUrl = await imgUrlHandle.jsonValue();
        console.log('Image URL:', imgUrl);
    } else {
        console.error('Img element not found');
    }

    //Dollar Value
    let dollars; 

    const [el3] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/div[2]/div[1]/div[1]/span[1]/span[2]');
    if (el3) {
        const dollarsHandle = await el3.getProperty('textContent');
        dollars = await dollarsHandle.jsonValue();
    } else {
        console.error('Dollars element not found');
    }

    //Cents
    const [el4] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/div[2]/div[1]/div[1]/span[1]/span[3]');
    if (el4) {
        const centsHandle = await el4.getProperty('textContent');
        const cents = await centsHandle.jsonValue();
        console.log('Price:', (dollars + cents));
    } else {
        console.error('Cents element not found');
    }

    browser.close();
}
