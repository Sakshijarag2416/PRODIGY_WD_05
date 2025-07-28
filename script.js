const weatherApi = {
    apiKey: "1e3e8f230b6064d27976e41163a82b77", // Your API key
    fetchWeather: function(city) {
        document.querySelector(".weather").classList.add("loading"); // Show loading state
        document.querySelector(".error").style.display = "none"; // Hide any previous errors

        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
        .then(response => {
            if (!response.ok) {
                // If response is not OK (e.g., 404 for city not found)
                throw new Error("City not found.");
            }
            return response.json();
        })
        .then(data => this.displayWeather(data))
        .catch(error => {
            console.error("Error fetching weather:", error);
            document.querySelector(".weather").classList.add("loading"); // Keep content hidden
            document.querySelector(".error").style.display = "block";
            // Ensure the error message specifically says "Invalid city name." for 404 or other network issues
            document.querySelector(".error p").textContent = "Invalid city name. Please try again.";
        });
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        // Use @2x for higher resolution icons from OpenWeatherMap
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°C"; // Round temperature for cleaner display
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        // Convert wind speed from m/s to km/h and round to 1 decimal place
        document.querySelector(".wind").innerText = "Wind speed: " + (speed * 3.6).toFixed(1) + " km/h";

        document.querySelector(".weather").classList.remove("loading"); // Remove loading state to show content
        document.querySelector(".error").style.display = "none"; // Ensure error is hidden if it was previously shown
    },
    search: function() {
        const city = document.querySelector(".search-bar").value.trim(); // Trim whitespace
        if (city) {
            this.fetchWeather(city);
        } else {
            // If search bar is empty, show an error and hide weather info
            document.querySelector(".error").style.display = "block";
            document.querySelector(".error p").textContent = "Please enter a city name.";
            document.querySelector(".weather").classList.add("loading"); // Keep weather content hidden
        }
    }
};

// Event listener for the search button
document.querySelector(".search-btn").addEventListener("click", function() {
    weatherApi.search();
});

// Event listener for pressing Enter key in the search bar
document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") { // Use '==' or '===' for comparison
        weatherApi.search();
    }
});

// Fetch weather for a default city when the page loads
// Based on current context, "Pune" is a good default.
document.addEventListener('DOMContentLoaded', () => {
    weatherApi.fetchWeather("Pune");
});