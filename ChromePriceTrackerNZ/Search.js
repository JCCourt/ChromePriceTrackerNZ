document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("myForm");
  var loaderWrapper = document.getElementById("loader-wrapper");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Show the loader wrapper
    loaderWrapper.style.display = "block";

    // Log before showing the loader (optional)
    console.log("Loader shown");

    // Simulate a delay or perform your actual form submission logic here
    setTimeout(function () {
      // Hide the loader wrapper after the simulated delay or form submission logic
      loaderWrapper.style.display = "none";

      // Log after hiding the loader (optional)
      console.log("Loader hidden");

      // You can include any specific actions you need here
    }, 2000); // Simulated delay of 2 seconds, adjust as needed
  });
});