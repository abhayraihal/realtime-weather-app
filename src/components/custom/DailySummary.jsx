import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoIosRefresh } from "react-icons/io";

function DailySummary({ city }) {
  const [dailySummary, setDailySummary] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState(5); // Default to 5 minutes
  const [intervalId, setIntervalId] = useState(null);
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      const data = response.data;
      console.log("Fetched weather data:", data);

      const weather = {
        temp: data.main.temp - 273.15, // Convert Kelvin to Celsius
        main: data.weather[0].main,
        feels_like: data.main.feels_like - 273.15,
        dt: Timestamp.fromDate(new Date()), // Store the timestamp
      };

      await saveDataToFirebase(weather); // Save the data
      await fetchDailySummaryFromFirebase(); // Fetch the summary from Firebase after saving
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to store weather data in Firebase
  const saveDataToFirebase = async (data) => {
    try {
      const weatherCollection = collection(db, 'WeatherDetails');
      const currentTime = new Date();
      const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000); // Check for entries in the last 5 minutes
  
      const q = query(
        weatherCollection,
        where('city', '==', city),
        where('dt', '>=', Timestamp.fromDate(fiveMinutesAgo))
      );
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // Only save data if there's no existing data from the last 5 minutes
        await addDoc(weatherCollection, { ...data, city });
        console.log('Data saved to Firebase:', data);
      } else {
        console.log('Duplicate data detected, skipping save.');
      }
    } catch (error) {
      console.error('Error saving weather data to Firebase:', error);
    }
  };

  // Function to fetch weather data from Firebase and calculate the daily summary
  const fetchDailySummaryFromFirebase = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of current day
      const q = query(
        collection(db, 'WeatherDetails'),
        where('city', '==', city),
        where('dt', '>=', Timestamp.fromDate(startOfDay)) // Get data only from today
      );
      const querySnapshot = await getDocs(q);

      let tempSum = 0;
      let tempMin = Infinity;
      let tempMax = -Infinity;
      const weatherConditions = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempSum += data.temp;
        if (data.temp < tempMin) tempMin = data.temp;
        if (data.temp > tempMax) tempMax = data.temp;

        // Count weather conditions
        if (weatherConditions[data.main]) {
          weatherConditions[data.main]++;
        } else {
          weatherConditions[data.main] = 1;
        }
      });

      const count = querySnapshot.size;
      if (count > 0) {
        const dominantCondition = Object.keys(weatherConditions).reduce((a, b) =>
          weatherConditions[a] > weatherConditions[b] ? a : b
        );

        setDailySummary({
          averageTemp: tempSum / count,
          maxTemp: tempMax,
          minTemp: tempMin,
          dominantCondition,
        });
      } else {
        setDailySummary(null); // No data to show
      }
    } catch (error) {
      console.error('Error fetching daily summary from Firebase:', error);
    }
  };

  // Set up an interval to fetch weather data at a user-defined interval
  const startDataFetchInterval = () => {
    if (intervalId) {
      clearInterval(intervalId); // Clear existing interval if any
    }

    // Fetch data immediately before setting the interval
    fetchWeatherData();

    const id = setInterval(fetchWeatherData, intervalMinutes * 60 * 1000); // Convert minutes to ms
    setIntervalId(id);
  };

  useEffect(() => {
    // Start fetching data on component mount and set interval
    startDataFetchInterval();

    // Clean up the interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalMinutes, city]);

  return (
    <Card className="daily-summary relative p-5 shadow-lg rounded-lg">
      {/* Header */}
      <CardHeader className="mb-4">
        <CardTitle className="text-xl font-semibold">Daily Weather Summary for {city}</CardTitle>
      </CardHeader>

      {/* Interval configuration, positioned at top right */}
      <div className="absolute top-5 right-5 flex items-center space-x-2">
        <label htmlFor="interval" className="text-sm font-medium text-gray-600">Fetch Interval (min):</label>
        <input
          type="number"
          id="interval"
          className="w-16 px-2 py-1 border rounded-md focus:outline-none"
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(Number(e.target.value))}
        />
        <Button size="sm" onClick={startDataFetchInterval}>Update</Button>
      </div>

      {/* Card content */}
      <CardContent>
        {dailySummary ? (
          <div className="space-y-2">
            <p className="text-lg">Average Temp: {dailySummary.averageTemp.toFixed(2)}°C</p>
            <p className="text-lg">Max Temp: {dailySummary.maxTemp.toFixed(2)}°C</p>
            <p className="text-lg">Min Temp: {dailySummary.minTemp.toFixed(2)}°C</p>
            <p className="text-lg">Dominant Condition: {dailySummary.dominantCondition}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading summary...</p>
        )}
      </CardContent>

      {/* Footer with Last Updated */}
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</p>
        
        {/* Refresh icon at bottom right */}
        <IoIosRefresh
          className="text-xl cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={fetchWeatherData}
        />
      </CardFooter>
    </Card>
  );
}

export default DailySummary;
