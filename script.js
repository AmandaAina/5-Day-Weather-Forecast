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
        `;
    }

    // Function to display 5-day forecast
    function displayForecast(data) {
        // Extract relevant information from the data and display the 5-day forecast
        // ...

        // You need to implement the logic to display the 5-day forecast based on the data.
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
});
