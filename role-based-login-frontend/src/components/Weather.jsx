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

    return (
        <div className="weather-widget">
            <span style={{ fontSize: "1.2rem" }}>⛅</span> {weather}
        </div>
    );
};

export default Weather;
