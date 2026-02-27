const apiKey = "YOUR_API_KEY"; // 🔴 Replace with your API key

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherResult = document.getElementById("weather-result");
const forecastContainer = document.getElementById("forecast-container");
const forecastTitle = document.getElementById("forecast-title");
const recentContainer = document.getElementById("recent-searches");

// Load from localStorage
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Fetch Weather Function
async function fetchWeather(city) {
  try {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert("City not found!");
      return;
    }

    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(weatherData);
    displayForecast(forecastData);

    saveCity(city);

  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Display Current Weather
function displayCurrentWeather(data) {
  weatherResult.innerHTML = `
    <h2>${data.name}</h2>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>🌥 Weather: ${data.weather[0].description}</p>
    <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Display 5 Day Forecast
function displayForecast(data) {
  forecastContainer.innerHTML = "";
  forecastTitle.textContent = "5-Day Forecast";

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(day => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    const date = new Date(day.dt_txt).toDateString();

    card.innerHTML = `
      <h4>${date}</h4>
      <p>🌡 ${day.main.temp}°C</p>
      <p>${day.weather[0].description}</p>
    `;

    forecastContainer.appendChild(card);
  });
}

// Save City in localStorage
function saveCity(city) {
  if (!recentCities.includes(city)) {
    recentCities.push(city);
  }

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  localStorage.setItem("lastCity", city);

  displayRecentCities();
}

// Display Recent Search Buttons
function displayRecentCities() {
  recentContainer.innerHTML = "";

  recentCities.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", () => {
      fetchWeather(city);
    });

    recentContainer.appendChild(btn);
  });
}

// Search Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeather(city);
  }
});

// Auto Load Last City
window.addEventListener("load", () => {
  displayRecentCities();

  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    fetchWeather(lastCity);
  }
});