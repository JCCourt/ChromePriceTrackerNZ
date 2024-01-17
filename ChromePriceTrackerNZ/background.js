// Background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'trackPrice') {
    // Handle the received information
    console.log('Product Title:', request.title);
    console.log('Product Price:', request.price);

    // You can perform additional logic here

    // Send a response back if needed
    sendResponse({ status: 'Price tracked successfully' });
  }
});
