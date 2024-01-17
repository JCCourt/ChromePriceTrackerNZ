// content.js

// Check if jQuery is available, if not inject it
if (typeof jQuery === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-3.6.4.min.js';
  script.type = 'text/javascript';
  script.onload = scrapePrices; // Call the function once jQuery is loaded
  document.head.appendChild(script);
} else {
  scrapePrices();
}

function scrapePrices() {
  // Your scraping logic here
  // This is just a generic example, you'll need to adapt it to the specific website

  // Example: Scraping prices with jQuery
  const prices = [];
  $('.product-price').each(function () {
    const priceText = $(this).text().trim();
    const price = parseFloat(priceText.replace('$', '').replace(',', ''));
    prices.push(price);
  });

  // Send the scraped prices to the background script
  chrome.runtime.sendMessage({ prices: prices });
}