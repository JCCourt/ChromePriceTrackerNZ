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

    console.log('Sending request to server with search query:', searchQuery);
    fetch(`/scrape?search=${encodeURIComponent(searchQuery)}`)
      .then(response => {
        console.log('Response received:', response); // Log the response received
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data); // Log the data received
        loader.style.display = 'none'; // Hide loader once results are fetched
        
        searchResultsContainer.innerHTML = ''; // Clear previous results

        if (data.error) {
          // Display error message
          const errorMessage = document.createElement('p');
          errorMessage.textContent = data.error;
          searchResultsContainer.appendChild(errorMessage);
          console.log('Error:', data.error);
        } else {
          // Display the results
          data.forEach((item, index) => {
            // Create a table row for each item
            const row = document.createElement('tr');

            // Logo column
            const logoCell = document.createElement('td');
            logoCell.style.border = '1px solid #ddd';
            const logoImg = document.createElement('img');
            logoImg.src = index === 0 ? './images/amazonau.jpg' :
             index === 1 ? './images/MightyApeLogo.png' :
             index === 2 ? './images/jbhifiLogo.png' : './images/ComputerLoungeLogo.png';           
            logoImg.style.width = '50px';
            logoImg.style.height = 'auto';
            logoCell.appendChild(logoImg);
            row.appendChild(logoCell);

            // Product image column
            const imageCell = document.createElement('td');
            imageCell.style.border = '1px solid #ddd';
            if (item.imgSrc) {
              const img = document.createElement('img');
              img.src = item.imgSrc;
              img.style.width = '50px';
              img.style.height = 'auto';
              imageCell.appendChild(img);
            } else {
              console.log('Image URL is not defined:', item);
            }
            row.appendChild(imageCell);

            // Product name column
            const nameCell = document.createElement('td');
            nameCell.textContent = item.title;
            nameCell.style.border = '1px solid #ddd';
            row.appendChild(nameCell);

            // Price column
            const priceCell = document.createElement('td');
            if (index < 1) {
              priceCell.textContent = item.roundedPrice;
            } else {
              priceCell.textContent = item.price;
            }
            priceCell.style.border = '1px solid #ddd';
            row.appendChild(priceCell);

            searchResultsContainer.appendChild(row);
          });

          console.log('Results displayed:', data);
        }
      })
      .catch(error => {
        loader.style.display = 'none';
        console.error('Error fetching search results:', error);
      });
  });
});
