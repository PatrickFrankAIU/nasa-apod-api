// main.js

// NASA API Key - Replace with your own from https://api.nasa.gov/
const API_KEY = "DEMO_KEY";  // Use DEMO_KEY for limited usage or get your own key

// DOM Elements
let datePickerElement = document.getElementById("date-picker");
let fetchButtonElement = document.getElementById("fetch-button");
let loadingElement = document.getElementById("loading");
let errorMessageElement = document.getElementById("error-message");
let resultElement = document.getElementById("result");
let titleElement = document.getElementById("title");
let imageElement = document.getElementById("apod-image");
let dateElement = document.getElementById("date");
let explanationElement = document.getElementById("explanation");

// Set the default date to today
let today = new Date(); 
// today.toISOString() returns the date in the format YYYY-MM-DDTHH:mm:ss.sssZ. 
// splitting it at ("T") and taking only [0] extracts only YYYY-MM-DD which is expected for the query
let formattedDate = today.toISOString().split("T")[0]; 
datePickerElement.value = formattedDate;
datePickerElement.max = formattedDate; 
// above line sets max to current date, which is why future dates are greyed out in the control 

// Add event listener to the fetch button
fetchButtonElement.addEventListener("click", () => {
    fetchAPOD(datePickerElement.value);
});

// Fetch the APOD when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchAPOD(formattedDate);
});

// Function to fetch the Astronomy Picture of the Day
async function fetchAPOD(date) {
    // Show loading, hide results and error (removes CSS class to make visible) 
    loadingElement.classList.remove("hidden");
    resultElement.classList.add("hidden");
    errorMessageElement.classList.add("hidden");
    
    try {
        // Construct the API URL
        let apiUrl = "https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&date=" + date;
        
        // Use fetch with async/await to get the data
        let response = await fetch(apiUrl);
        
        // Check if the response is successful
		// The catch block handles errors like network issues or invalid JSON parsing
		// This catches invalid HTTP response codes -- anything not in the 2xx range 
        if (!response.ok) {
            throw new Error("Network response was not ok: " + response.statusText);
        }
        
        // Parse the JSON data
        let data = await response.json();
        
        // Update the UI with the fetched data
        displayAPOD(data);
    } catch (error) { // don't forget the parameter! 
        // Handle any errors
        console.error("Error fetching APOD:", error);
        errorMessageElement.classList.remove("hidden");
    } finally {
        // Hide loading indicator regardless of success or failure
        loadingElement.classList.add("hidden");
    }
}

// Function to display the fetched APOD data
// This one doesn't need to be async because it's just updating the HTML, not doing any networking
function displayAPOD(data) {
    // Update the UI elements with data
    titleElement.textContent = data.title;
    imageElement.src = data.url;
    imageElement.alt = data.title;
    dateElement.textContent = "Date: " + data.date;
    explanationElement.textContent = data.explanation;
    
    // Show the result container
    resultElement.classList.remove("hidden");
}