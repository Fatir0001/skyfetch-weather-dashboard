const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

const API_KEY = "YOUR_API_KEY_HERE"; // put your real key

async function fetchWeather(city) {
  try {
    loadingDiv.style.display = "block";
    errorDiv.textContent = "";
    weatherContainer.innerHTML = "";

    if (!city.trim()) {
      throw new Error("City name cannot be empty");
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    weatherContainer.innerHTML = `
      <h2>${data.name}</h2>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;
  } catch (error) {
    errorDiv.textContent = error.message;
  } finally {
    loadingDiv.style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  fetchWeather(cityInput.value);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchWeather(cityInput.value);
  }
});