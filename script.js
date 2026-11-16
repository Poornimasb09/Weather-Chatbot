
const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");

function addMessage(message, className) {
    const div = document.createElement("div");
    div.className = className;
    div.textContent = message;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function getWeather(city) {
    try {
        addMessage("Checking weather for " + city + "...", "bot-message");

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            addMessage("Sorry, city not found. Try another city.", "bot-message");
            return;
        }

        const place = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`
        );

        const data = await weatherResponse.json();
        const weather = data.current;

        const answer =
            `Weather in ${place.name}:\n` +
            `Temperature: ${weather.temperature_2m}°C\n` +
            `Feels like: ${weather.apparent_temperature}°C\n` +
            `Humidity: ${weather.relative_humidity_2m}%\n` +
            `Wind Speed: ${weather.wind_speed_10m} km/h\n` +
            `Precipitation: ${weather.precipitation} mm\n` +
            `Condition: ${getCondition(weather.weather_code)}`;

        addMessage(answer, "bot-message");

    } catch (error) {
        addMessage("Unable to get weather data. Please check your internet connection.", "bot-message");
        console.error(error);
    }
}

function getCondition(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Partly cloudy or cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Weather condition unavailable";
}

function sendMessage() {
    const city = userInput.value.trim();

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    addMessage(city, "user-message");
    userInput.value = "";
    getWeather(city);
}

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
