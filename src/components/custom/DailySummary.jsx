import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DailySummary({ city }) {
  const [dailySummary, setDailySummary] = useState(null);
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
  
  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      const data = response.data;
      console.log(data);

      const weather = {
        temp: data.main.temp - 273.15, // Convert Kelvin to Celsius
        main: data.weather[0].main,
        feels_like: data.main.feels_like - 273.15,
        dt: data.dt,
      };

      processWeatherData(weather);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to process the weather data and calculate daily aggregates
  const processWeatherData = (data) => {
    const currentDate = new Date().toLocaleDateString();
    const dailyData = { ...data, date: currentDate };

    const averageTemp = dailyData.temp;
    const maxTemp = dailyData.temp;
    const minTemp = dailyData.temp;
    const dominantCondition = dailyData.main;

    const summary = {
      date: currentDate,
      averageTemp,
      maxTemp,
      minTemp,
      dominantCondition,
    };

    setDailySummary(summary);

    // Store the summary in local storage for now (you can change this to a database call later)
    localStorage.setItem('dailySummary', JSON.stringify(summary));
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  return (
    <div className="daily-summary">
      <h2>Daily Weather Summary for {city}</h2>
      {dailySummary ? (
        <div>
          <p>Average Temp: {dailySummary.averageTemp.toFixed(2)}°C</p>
          <p>Max Temp: {dailySummary.maxTemp.toFixed(2)}°C</p>
          <p>Min Temp: {dailySummary.minTemp.toFixed(2)}°C</p>
          <p>Dominant Condition: {dailySummary.dominantCondition}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DailySummary;
