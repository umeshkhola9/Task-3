// -------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------
const WEATHER_API_KEY = "26c6837c60b340e429683885d0209045";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// -------------------------------------------------------
// DOM REFERENCES
// -------------------------------------------------------
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherLoading = document.getElementById("weather-loading");
const weatherError = document.getElementById("weather-error");
const weatherResult = document.getElementById("weather-result");

const cityNameEl = document.getElementById("city-name");
const weatherDescEl = document.getElementById("weather-desc");
const weatherIconEl = document.getElementById("weather-icon");
const weatherTempEl = document.getElementById("weather-temp");
const humidityEl = document.getElementById("weather-humidity");
const windEl = document.getElementById("weather-wind");

// -------------------------------------------------------
// HELPER: show / hide elements
// -------------------------------------------------------
function show(el) {
    el.classList.remove("hidden");
}
function hide(el) {
    el.classList.add("hidden");
}

// -------------------------------------------------------
// WEATHER: FETCH & DISPLAY
// Uses: Fetch API, Async/Await, JSON Parsing, Try/Catch
// -------------------------------------------------------
async function fetchWeather(city) {
    // Show loading, hide previous results / errors
    show(weatherLoading);
    hide(weatherError);
    hide(weatherResult);
    weatherError.textContent = "";

    try {
        const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

        // Fetch API + Promise (await)
        const response = await fetch(url);

        // JSON Parsing
        const data = await response.json();

        if (!response.ok) {
            // OpenWeatherMap returns { cod, message } on errors
            throw new Error(
                data.message || "City not found. Please try again."
            );
        }

        displayWeather(data);

        // Persist last searched city in LocalStorage
        localStorage.setItem("lastWeatherCity", city.trim());
    } catch (err) {
        // Try/Catch error handling — friendly messages
        hide(weatherResult);
        weatherError.textContent =
            err.message === "Failed to fetch"
                ? "⚠️ Network error. Please check your internet connection."
                : `⚠️ ${err.message}`;
        show(weatherError);
    } finally {
        hide(weatherLoading);
    }
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const icon = weather[0].icon;
    const desc = weather[0].description;

    cityNameEl.textContent = `${name}, ${data.sys.country}`;
    weatherDescEl.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
    weatherTempEl.textContent = `${Math.round(main.temp)}°C`;
    humidityEl.textContent = `${main.humidity}%`;
    windEl.textContent = `${wind.speed} m/s`;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIconEl.alt = desc;

    show(weatherResult);
}

// -------------------------------------------------------
// SEARCH EVENT LISTENERS
// -------------------------------------------------------
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

// -------------------------------------------------------
// AUTO-LOAD LAST SEARCHED CITY (LocalStorage)
// -------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    const lastCity = localStorage.getItem("lastWeatherCity");
    if (lastCity) {
        cityInput.value = lastCity;
        fetchWeather(lastCity);
    }
});
