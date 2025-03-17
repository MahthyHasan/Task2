import axios from "axios";
import Weather from "../models/weather.model.js";
import User from "../models/user.model.js";

export const fetchWeather = async (req, res) => {
    try {
        const { lat, lon, userId } = req.query;
        if (!lat || !lon || !userId) {
            return res.status(400).json({ message: "Latitude, Longitude, and userId are required" });
        }

        // Fetch weather data from OpenWeatherMap API
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );

        const { temp, humidity } = response.data.main;
        const description = response.data.weather[0].description;
        const date = new Date().toISOString().split("T")[0]; // Store only YYYY-MM-DD

        // Store the weather report in MongoDB
        const weatherReport = new Weather({
            userId,
            date,
            temperature: temp,
            humidity,
            description,
        });

        await weatherReport.save();

        res.status(200).json({ message: "Weather data stored", weather: weatherReport });
    } catch (error) {
        console.error(`Error fetching weather: ${error.message}`);
        res.status(500).json({ message: "Failed to fetch weather data" });
    }
};
