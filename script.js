const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');

// Get coordinates of the city using Nominatim (OpenStreetMap)
async function getCoordinates(city) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
  const data = await response.json();
  if (data.length === 0) throw new Error('City not found');
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].display_name
  };
}

// Get weather from Open-Meteo
async function getWeather(city) {
  try {
    const { lat, lon, name } = await getCoordinates(city);

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    const weather = data.current_weather;

    weatherInfo.innerHTML = `
      <h2>${name}</h2>
      <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
      <p><strong>Weather Code:</strong> ${weather.weathercode}</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    weatherInfo.innerHTML = 'Loading...';
    getWeather(city);
  } else {
    weatherInfo.innerHTML = '<p style="color:red;">Please enter a city name</p>';
  }
});

