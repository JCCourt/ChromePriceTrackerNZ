const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/div[1]/ul/li[1]/span/a/img');
    const src = await el.getProperty('src');
    const imgURL = await src.jsonValue();

    const [el2] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/header/div/div[1]/h1');
    const txt = await el2.getProperty('textContent');
    const title = await txt.jsonValue();

    const [el3] = await page.$x('/html/body/div[4]/div[2]/div/main/div[1]/div[2]/div[1]/div[1]/span/span[2]');
    const txt2 = await el3.getProperty('textContent');
    const price = await txt2.jsonValue();

    console.log({imgURL, title, price});

    await browser.close();
    }

scrapeProduct('https://www.mightyape.co.nz/product/ovela-glasgow-study-desk-oak-finish/34671395');
