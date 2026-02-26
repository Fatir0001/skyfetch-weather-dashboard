// SkyFetch Weather Dashboard - API Integration
const apiKey = "YOUR_API_KEY_HERE";
const cityName = "London";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

axios.get(url)
    .then(function(response) {
        const data = response.data;

        document.getElementById("city").textContent = data.name;
        document.getElementById("temperature").textContent = "Temperature: " + data.main.temp + "°C";
        document.getElementById("description").textContent = "Condition: " + data.weather[0].description;

        const iconCode = data.weather[0].icon;
        document.getElementById("icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    })
    .catch(function(error) {
        console.error("Error fetching weather data:", error);
    });