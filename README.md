# Javascript

## Weather API Display Documentation

### Overview
The Weather API Display is a web application that fetches and displays real-time weather data for a specified location. It is built using HTML, CSS, and JavaScript, leveraging the Open-Meteo API for data retrieval.

### Features
- Fetch current weather data for any location.
- Display temperature, humidity, wind speed, and weather conditions.
- Search functionality to find weather details for different cities.
- Responsive design for seamless viewing on various devices.

### File Structure
```
/weather-api-display
│
├── index.html       # The main HTML file
├── style.css        # The CSS file for styling
└── index.js         # The JavaScript file for API integration and functionality
```

### Example
Below is an example of how the weather data is displayed:
```
Location: New York
Temperature: 25°C
Humidity: 60%
Wind Speed: 10 km/h
Condition: Clear Sky
```

### API Integration
The application uses the Open-Meteo API to fetch weather data. Ensure you construct the API URL correctly in the `index.js` file as shown below:
```javascript
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=LATITUDE&longitude=LONGITUDE&current_weather=true`;
```
Replace `LATITUDE` and `LONGITUDE` with the coordinates of the desired location.

---

![alt text](image.png)