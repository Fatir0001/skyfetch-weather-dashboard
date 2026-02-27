function WeatherApp(apiKey) {
  this.apiKey = apiKey;
  this.currentWeatherDiv = document.getElementById("currentWeather");
  this.forecastContainer = document.getElementById("forecastContainer");
  this.searchBtn = document.getElementById("searchBtn");
  this.cityInput = document.getElementById("cityInput");

  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
}

WeatherApp.prototype.handleSearch = function() {
  const city = this.cityInput.value;
  if (!city) return;

  const currentURL = 
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

  const forecastURL = 
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

  Promise.all([
    fetch(currentURL),
    fetch(forecastURL)
  ])
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(data => {
    const currentData = data[0];
    const forecastData = data[1];

    this.displayCurrentWeather(currentData);
    this.displayForecast(forecastData);
  })
  .catch(error => {
    alert("City not found");
  });
};

WeatherApp.prototype.displayCurrentWeather = function(data) {
  this.currentWeatherDiv.innerHTML = `
    <h3>${data.name}</h3>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>
  `;
};

WeatherApp.prototype.displayForecast = function(data) {
  this.forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item => 
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    const date = new Date(day.dt_txt).toDateString();

    card.innerHTML = `
      <h4>${date}</h4>
      <p>${day.main.temp} °C</p>
      <p>${day.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
    `;

    this.forecastContainer.appendChild(card);
  });
};

new WeatherApp("YOUR_API_KEY");