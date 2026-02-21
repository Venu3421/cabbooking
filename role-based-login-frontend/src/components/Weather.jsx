import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [weather, setWeather] = useState('Wait a sec...');

    useEffect(() => {
        const fetchWeather = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const response = await axios.get(`http://localhost:8081/weather?lat=${latitude}&lon=${longitude}`);
                            setWeather(response.data);
                        } catch (error) {
                            console.error("Error fetching weather with location:", error);
                            setWeather("Weather unavailable");
                        }
                    },
                    async (error) => {
                        console.warn("Location permission denied or unavailable:", error);
                        try {
                            const response = await axios.get('http://localhost:8081/weather');
                            setWeather(response.data);
                        } catch (err) {
                            console.error("Error fetching default weather:", err);
                            setWeather("Weather unavailable");
                        }
                    },
                    { timeout: 3000 } // Add strict 3-second timeout
                );
            } else {
                try {
                    const response = await axios.get('http://localhost:8081/weather');
                    setWeather(response.data);
                } catch (error) {
                    console.error("Error fetching weather:", error);
                }
            }
        };

        fetchWeather();

        // Refresh every 5 minutes
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, []);

    if (!weather) return null;

    let icon = "⛅";
    const wLow = weather.toLowerCase();
    if (wLow.includes("clear") || wLow.includes("sun")) icon = "☀️";
    else if (wLow.includes("rain") || wLow.includes("drizzle")) icon = "🌧️";
    else if (wLow.includes("cloud")) icon = "☁️";
    else if (wLow.includes("thunder")) icon = "⛈️";
    else if (wLow.includes("snow")) icon = "❄️";

    return (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-sm leading-none">{icon}</span>
            <span>{weather}</span>
        </div>
    );
};

export default Weather;
