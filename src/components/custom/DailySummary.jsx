import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { collection, query, where, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoIosRefresh } from "react-icons/io";
import { RiFahrenheitFill, RiCelsiusLine } from "react-icons/ri";

function DailySummary({ city }) {
  const [dailySummary, setDailySummary] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState(5); // Default to 5 minutes
  const [intervalId, setIntervalId] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

  // Function to convert Celsius to Fahrenheit
  const convertToFahrenheit = (celsius) => (celsius * 9/5) + 32;

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

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
        dt: new Date(),
      };

      await updateDailyAverageInFirebase(weather); // Save or update the daily average
      await fetchDailySummaryFromFirebase(); // Fetch the updated summary from Firebase
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to update the daily average data in Firebase
  const updateDailyAverageInFirebase = async (data) => {
    try {
      const weatherCollection = collection(db, 'DailyWeatherSummary');
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the current day

      const q = query(
        weatherCollection,
        where('city', '==', city),
        where('date', '>=', Timestamp.fromDate(startOfDay)) // Look for today's entry
      );
      const querySnapshot = await getDocs(q);

      let dailyDocRef;
      let dailyData;

      if (!querySnapshot.empty) {
        // Update existing entry for today
        querySnapshot.forEach((doc) => {
          dailyDocRef = doc.ref;
          dailyData = doc.data();
        });
      } else {
        // Create a new entry for today
        dailyDocRef = doc(weatherCollection);
        dailyData = {
          city,
          date: Timestamp.fromDate(startOfDay),
          tempSum: 0,
          tempCount: 0,
          tempMin: Infinity,
          tempMax: -Infinity,
          weatherConditions: {},
        };
      }

      // Update the daily data
      dailyData.tempSum += data.temp;
      dailyData.tempCount += 1;
      dailyData.tempMin = Math.min(dailyData.tempMin, data.temp);
      dailyData.tempMax = Math.max(dailyData.tempMax, data.temp);

      // Update weather conditions count
      if (dailyData.weatherConditions[data.main]) {
        dailyData.weatherConditions[data.main]++;
      } else {
        dailyData.weatherConditions[data.main] = 1;
      }

      // Save the updated data to Firebase
      await setDoc(dailyDocRef, dailyData);
      console.log('Daily average updated in Firebase:', dailyData);
    } catch (error) {
      console.error('Error updating daily average in Firebase:', error);
    }
  };

  // Function to fetch the daily summary from Firebase
  const fetchDailySummaryFromFirebase = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the current day
      const q = query(
        collection(db, 'DailyWeatherSummary'),
        where('city', '==', city),
        where('date', '>=', Timestamp.fromDate(startOfDay)) // Get data only from today
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const dominantCondition = Object.keys(data.weatherConditions).reduce((a, b) =>
            data.weatherConditions[a] > data.weatherConditions[b] ? a : b
          );

          setDailySummary({
            averageTemp: data.tempSum / data.tempCount,
            maxTemp: data.tempMax,
            minTemp: data.tempMin,
            dominantCondition,
          });
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
        <CardTitle className="text-xl font-semibold">
          Daily Weather Summary for {city} &nbsp;&nbsp;
          <Button size="sm" onClick={toggleTemperatureUnit}>
            {isCelsius ? <RiCelsiusLine /> : <RiFahrenheitFill />}
          </Button>
        </CardTitle>
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
            <p className="text-lg">
              Average Temp: {isCelsius ? dailySummary.averageTemp.toFixed(2) : convertToFahrenheit(dailySummary.averageTemp).toFixed(2)}°{isCelsius ? 'C' : 'F'}
            </p>
            <p className="text-lg">
              Max Temp: {isCelsius ? dailySummary.maxTemp.toFixed(2) : convertToFahrenheit(dailySummary.maxTemp).toFixed(2)}°{isCelsius ? 'C' : 'F'}
            </p>
            <p className="text-lg">
              Min Temp: {isCelsius ? dailySummary.minTemp.toFixed(2) : convertToFahrenheit(dailySummary.minTemp).toFixed(2)}°{isCelsius ? 'C' : 'F'}
            </p>
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
          className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={fetchWeatherData}
        />
      </CardFooter>
    </Card>
  );
}

export default DailySummary;
