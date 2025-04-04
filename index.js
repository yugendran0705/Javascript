const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

const weatherCodes = {
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    51: 'Light drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow'
};

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error('City not found');
        }

        const geoData = await geoResponse.json();
        console.log(geoData);
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        console.log(weatherData);
        displayWeather(name, country, weatherData.current);
        hideError();
        cityInput.value = '';
    } catch (error) {
        showError(error.message);
        hideWeather();
    }
}

async function getCurrentLocationWeather() {
    let latitude, longitude;
    navigator.geolocation.getCurrentPosition(async (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const weatherData = await weatherResponse.json();
            //console.log(weatherData);
            displayWeather("Current Location", '', weatherData.current);
            hideError();
            cityInput.value = '';
        } catch (error) {
            showError(error.message);
            hideWeather();
        }
    });
}

function displayWeather(cityName, country, weatherData) {
    const cityDisplay = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const description = document.getElementById('description');

    cityDisplay.textContent = `${cityName}, ${country}`;
    temperature.textContent = `Temperature: ${weatherData.temperature_2m}°C`;
    humidity.textContent = `Humidity: ${weatherData.relative_humidity_2m}%`;
    description.textContent = `Conditions: ${weatherCodes[weatherData.weather_code] || 'Unknown'}`;

    weatherInfo.classList.add('active');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
}

function hideError() {
    errorMessage.classList.remove('active');
}

function hideWeather() {
    weatherInfo.classList.remove('active');
}

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});