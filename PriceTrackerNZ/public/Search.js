document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('myForm');
  const loader = document.getElementById('loader-wrapper');
  const searchResultsContainer = document.getElementById('imageContainer');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const searchQuery = document.getElementById('productNameBarcode').value;
    console.log('Search query:', searchQuery); // Log search query

    loader.style.display = 'block'; // Show loader while fetching results
    console.log('Loader displayed'); // Log loader display

    // Perform scraping with Puppeteer
    fetch(`/scrape?search=${encodeURIComponent(searchQuery)}`)
      .then(response => {
        console.log('Response received:', response); // Log the response received
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data); // Log the data received
        loader.style.display = 'none'; // Hide loader once results are fetched

        searchResultsContainer.innerHTML = ''; // Clear previous results
        console.log('Previous results cleared'); // Log clearing previous results

        if (data.length === 0) {
          // Display message indicating no results found
          const noResultsMessage = document.createElement('p');
          noResultsMessage.textContent = 'No results found.';
          searchResultsContainer.appendChild(noResultsMessage);
          console.log('No results found');
        } else {
          // Display the results as a table
          const table = document.createElement('table');
          table.style.borderCollapse = 'collapse'; // Collapse borders

          // Create table header
          const headerRow = document.createElement('tr');
          const headerImage = document.createElement('th');
          headerImage.textContent = 'Image';
          const headerName = document.createElement('th');
          headerName.textContent = 'Name';
          const headerPrice = document.createElement('th');
          headerPrice.textContent = 'Price';
          headerRow.appendChild(headerImage);
          headerRow.appendChild(headerName);
          headerRow.appendChild(headerPrice);
          table.appendChild(headerRow);

          // Create table rows for each search result
          data.forEach(item => {
            const row = document.createElement('tr');

            // Image column
            const imageCell = document.createElement('td');
            imageCell.style.border = '1px solid #ddd'; // Add border
            if (item.imageUrl) {
              const img = document.createElement('img');
              img.src = item.imageUrl;
              img.style.width = '50px'; // Set width of image
              img.style.height = 'auto'; // Maintain aspect ratio
              imageCell.appendChild(img);
            } else {
              console.log('Image URL is not defined:', item);
            }
            row.appendChild(imageCell);

            // Name column
            const nameCell = document.createElement('td');
            nameCell.textContent = item.title;
            nameCell.style.border = '1px solid #ddd'; // Add border
            row.appendChild(nameCell);

            // Price column
            const priceCell = document.createElement('td');
            priceCell.textContent = item.price;
            priceCell.style.border = '1px solid #ddd'; // Add border
            row.appendChild(priceCell);

            // Append the row to the table
            table.appendChild(row);
          });

          // Append the table to the container
          searchResultsContainer.appendChild(table);

          console.log('Results displayed:', data); // Log displayed results
        }
      })
      .catch(error => {
        loader.style.display = 'none'; // Hide loader on error
        console.error('Error fetching search results:', error);
      });
  });
});
