# 🌦️ Real-Time Weather Monitoring with Rollups and Aggregates ⛅

## Overview

This project is a **real-time weather monitoring system** that processes weather data from the **OpenWeatherMap API** to provide summarized insights using rollups and aggregates. It displays daily weather summaries, historical trends, and allows for user-defined alert thresholds. The application focuses on six Indian metro cities: **Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad**.

The app is built using **React + Vite** ⚛️, **ShadCN**, and **TailwindCSS** 🎨 for the frontend, and stores aggregated data in **Firebase** ☁️. It is hosted online on **Vercel** 🚀.

Live Application: [🌐 Real-Time Weather Monitoring App](https://realtime-weather-app-ebon.vercel.app/)

---

## ⚙️ Features

1. **Real-Time Weather Data** 🌡️: Continuously fetches weather data for the six cities at a configurable interval (default: every 5 minutes) and displays it to the user.
   - **Weather Conditions** 🌧️: Main weather condition (e.g., Rain, Clear), current temperature, perceived temperature, humidity, wind speed.
   - **Temperature Conversion** 🌡️🔄: Users can toggle between Celsius and Fahrenheit.
   - **Auto-refresh** 🔄: Weather data updates without requiring a hard refresh.
   
2. **Daily Aggregates & Rollups** 📊:
   - **Average Temperature** 🌡️: Computed daily based on weather data.
   - **Max/Min Temperature** 📉📈: The highest and lowest temperatures recorded for the day.
   - **Dominant Weather Condition** ☀️🌧️: The most frequent weather condition for the day.
   - **Other Parameters**: Humidity and wind speed are also summarized.
   
3. **Alerting System** 🚨:
   - Users can configure alerts for specific weather conditions (e.g., temperature exceeding 35°C 🌡️🔥).
   - Alerts are triggered if the condition persists for three consecutive updates.
   - **(Bonus)** Email alerts can be set up ✉️ (though currently this functionality is displayed via console logs for demonstration).

4. **Data Management** 💾:
   - Daily weather summaries are stored in **Firebase** 🔥.
   - At midnight 🌙, data from the previous day is deleted to manage storage limits, ensuring the app remains performant.

---

## 🛠️ Technologies Used

- **Frontend**: React ⚛️ (with Vite), ShadCN, TailwindCSS 🎨.
- **Backend**: OpenWeatherMap API 🌍 for fetching weather data, Firebase ☁️ for data storage.
- **Hosting**: Vercel 🚀 (live demo hosted).
- **Alerts**: Currently configured to log alerts in the console 💻; email functionality is not fully implemented yet.

---

## 🧰 Installation and Setup

### Prerequisites
1. **Node.js** 🟢 (latest version recommended)
2. **Firebase account** 🔥 and **API key** from **OpenWeatherMap** 🌐.

### Running the Application Locally

1. **Clone the Repository**:
   ```bash
   git clone repo_url
   cd repo_name
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up API Key**:
   - Create a `.env.local` file in the root directory of the repository.
   - Add your OpenWeatherMap API key inside the file:
     ```bash
     VITE_OPEN_WEATHER_MAP_API_KEY=your_api_key_here
     ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` 🌐.

---

## 🔄 Application Flow

1. **Weather Data Fetching** 🌡️:
   - As soon as the website loads, the app sends a request to the OpenWeatherMap API 🌍 to fetch the current weather details for the six predefined cities.
   - The data is continuously fetched at a configurable interval (default: every 5 minutes) ⏱️.
   
2. **Data Display** 📊:
   - The city components are updated dynamically without refreshing the entire page.
   - For each city, the following fields are displayed:
     - Average temperature, min/max temperature, dominant weather condition, humidity, and wind speed 💨.

3. **Firebase Data Storage** 🔥:
   - Weather summaries for each day are stored in Firebase as documents under the `DailyWeatherSummary` collection 📁.
   - Each city’s document stores:
     - `tempSum`, `tempCount`, `tempMax`, `tempMin`
     - `humiditySum`, `humidityCount`
     - `windSpeedSum`, `windSpeedCount`
     - Dominant weather condition as a map of occurrences (e.g., {Haze: 332}).

4. **Alerts** 🚨:
   - Users can input their email ✉️ and specify alert conditions ⚠️.
   - Alerts are triggered if a condition is met continuously for 3 updates (though email alerts are currently console logs).

---

## ⚠️ Known Issues and Future Enhancements

### Current Limitations:
1. **Email Alerts** 📧: Mailing functionality is not fully implemented (currently logging to the console).
2. **Handling Spammed Alerts** 🔁: Alerts may trigger repeatedly every time the condition is met (requires improvement to trigger only once).
3. **Firebase Storage Limits** 💾: To avoid exceeding Firebase’s free tier storage limits, data from previous days is deleted daily.

### Future Enhancements 🚀:
1. **Email Handling** ✉️: Implement email alerts using a service like SendGrid or Firebase Cloud Functions.
2. **Improved UI** 🎨: Enhance user interface and add more visualizations for historical data and trends 📈.
3. **Weather Forecasting** 🌦️: Implement weather forecasting using machine learning algorithms like autoregression based on stored data.
4. **Data Accuracy** ✔️: Ensure the app runs continuously to avoid gaps in data collection, which might skew daily aggregates.

---

## 📄 License

This code is crafted with the brilliance of **Abhay**, combining the power of **GPT** and his sharp mind! 🤖💡