document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "4ee53ff0b8f63b54345518f7d7397399";
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

    const searchForm = document.getElementById("searchForm");
    const cityInput = document.getElementById("cityInput");
    const currentWeather = document.getElementById("currentWeather");
    const forecast = document.getElementById("forecast");
    const historyList = document.getElementById("historyList");

    // Event listener for the search form
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const cityName = cityInput.value.trim();

        if (cityName) {
            // Make API request
            getWeatherData(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });

    // Function to get weather data from the OpenWeatherMap API
    function getWeatherData(cityName) {
        const fullUrl = `${apiUrl}?q=${cityName}&appid=${apiKey}`;

        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                // Display current weather
                displayCurrentWeather(data);

                // Display 5-day forecast
                displayForecast(data);

                // Add city to search history
                addToSearchHistory(cityName);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                alert("Error fetching weather data. Please try again.");
            });
    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        // Extract relevant information from the data
        const city = data.city.name;
        const date = new Date(data.list[0].dt * 1000).toLocaleDateString();
        const iconCode = data.list[0].weather[0].icon;
        const temperature = data.list[0].main.temp;
        const humidity = data.list[0].main.humidity;
        const windSpeed = data.list[0].wind.speed;

        // Update the HTML
        currentWeather.innerHTML = `
            <h2>${city}</h2>
            <p>Date: ${date}</p>
            <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
            <p>Temperature: ${temperature} &#8451;</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            
            <!-- Comment Section -->
            <div class="comment-section" id="currentWeatherComments">
                <h3>Comments:</h3>
                <form class="comment-form" id="currentWeatherCommentForm">
                    <label for="currentWeatherCommentInput">Add a comment:</label>
                    <input type="text" id="currentWeatherCommentInput" required>
                    <button type="submit">Submit</button>
                </form>
                <ul class="comment-list" id="currentWeatherCommentList">
                    <!-- Display comments here -->
                </ul>
            </div>
        `;
    }

 // Function to display 5-day forecast
function displayForecast(data) {
    const forecastList = document.createElement("ul");
    forecastList.className = "forecast-list";

    // Extract relevant information for the next 5 days
    const forecastData = data.list.slice(1, 6); // Exclude the current day

    forecastData.forEach(dayData => {
        const date = new Date(dayData.dt * 1000).toLocaleDateString();
        const iconCode = dayData.weather[0].icon;
        const temperature = dayData.main.temp;
        const humidity = dayData.main.humidity;
        const windSpeed = dayData.wind.speed;

        const listItem = document.createElement("li");
        listItem.className = "forecast-item";
        listItem.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
            <p>Temperature: ${temperature} &#8451;</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        forecastList.appendChild(listItem);
    });

    // Clear previous forecast data
    forecast.innerHTML = "";

    // Append the forecast list to the forecast div
    forecast.appendChild(forecastList);
}


    // Function to add the city to the search history
    function addToSearchHistory(cityName) {
        // Create a list item and add it to the history list
        const listItem = document.createElement("li");
        listItem.textContent = cityName;

        // Add a click event listener to the list item to allow re-searching
        listItem.addEventListener("click", function () {
            getWeatherData(cityName);
        });

        // Add the list item to the history list
        historyList.appendChild(listItem);
    }

    // Event listener for the comment form for current weather
    const currentWeatherCommentForm = document.getElementById("currentWeatherCommentForm");
    currentWeatherCommentForm.addEventListener("submit", function (event) {
        handleCommentFormSubmit(event, "currentWeather");
    });

    // Event listener for the comment form for forecast (you need to implement this)
    // ...

    // Function to handle comment form submissions
    function handleCommentFormSubmit(event, section) {
        event.preventDefault();

        const commentInput = document.getElementById(`${section}CommentInput`);
        const comment = commentInput.value.trim();

        if (comment) {
            // Add comment to the current city and section
            const currentCity = getCurrentCity(); // You need to implement this function to get the current city.
            addComment(currentCity, section, comment);

            // Display updated comments
            displayComments(section, currentCity);

            // Clear the comment input field
            commentInput.value = "";
        } else {
            alert("Please enter a comment.");
        }
    }

    // Function to display comments for a section
    function displayComments(section, city) {
        const commentSection = document.getElementById(`${section}Comments`);
        const commentList = document.getElementById(`${section}CommentList`);

        // Get the comments for the city and section from localStorage
        const comments = getComments(city, section);

        // Update the HTML for comments
        commentList.innerHTML = ""; // Clear existing comments

        if (comments.length > 0) {
            comments.forEach(comment => {
                const commentItem = document.createElement("li");
                commentItem.textContent = comment;
                commentList.appendChild(commentItem);
            });
        } else {
            const noCommentsMessage = document.createElement("p");
            noCommentsMessage.textContent = "No comments yet.";
            commentList.appendChild(noCommentsMessage);
        }

        // Show the comment section
        commentSection.style.display = "block";
    }

    // Function to get comments from localStorage for a city and section
    function getComments(city, section) {
        const localStorageKey = `comments_${city}_${section}`;
        const storedComments = localStorage.getItem(localStorageKey);

        return storedComments ? JSON.parse(storedComments) : [];
    }

    // Function to add a comment for a city and section
    function addComment(city, section, comment) {
        const localStorageKey = `comments_${city}_${section}`;
        const comments = getComments(city, section);

        comments.push(comment);

        // Save updated comments to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(comments));
    }
});