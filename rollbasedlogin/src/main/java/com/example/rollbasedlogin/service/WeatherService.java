package com.example.rollbasedlogin.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

@Service
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.city:Hyderabad}")
    private String city;

    private String currentWeather = "Loading weather...";

    // Store last known coordinates to keep them updated via Schedule
    private Double lastLat;
    private Double lastLon;

    @PostConstruct
    public void init() {
        logger.info("Initializing WeatherService with city: {}", city);
        fetchWeather();
    }

    @Scheduled(fixedRate = 300000) // 5 minutes
    public void fetchWeather() {
        logger.info("Fetching weather data...");
        String url;
        if (lastLat != null && lastLon != null) {
            url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lastLat + "&lon=" + lastLon
                    + "&appid=" + apiKey + "&units=metric";
        } else {
            url = "https://api.openweathermap.org/data/2.5/weather?q=" + city
                    + "&appid=" + apiKey + "&units=metric";
        }
        fetchWeatherData(url);
    }

    public String getWeatherByCoordinates(double lat, double lon) {
        logger.info("Fetching weather for coordinates: lat={}, lon={}", lat, lon);
        this.lastLat = lat;
        this.lastLon = lon;
        String url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon
                + "&appid=" + apiKey + "&units=metric";
        fetchWeatherData(url);
        return currentWeather;
    }

    @SuppressWarnings("unchecked")
    private void fetchWeatherData(String url) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                String name = (String) body.get("name");
                Map<String, Object> main = (Map<String, Object>) body.get("main");
                List<Map<String, Object>> weatherList = (List<Map<String, Object>>) body.get("weather");

                if (main != null && weatherList != null && !weatherList.isEmpty()) {
                    Map<String, Object> weather = weatherList.get(0);
                    double temp = 0;
                    Object tempObj = main.get("temp");
                    if (tempObj instanceof Integer) {
                        temp = (Integer) tempObj;
                    } else if (tempObj instanceof Double) {
                        temp = (Double) tempObj;
                    }
                    String description = (String) weather.get("description");
                    this.currentWeather = String.format("Current weather in %s: %.1f°C, %s",
                            name != null ? name : city, temp, description);
                    logger.info("Weather updated: {}", this.currentWeather);
                } else {
                    this.currentWeather = "Weather data incomplete.";
                    logger.warn("Weather data incomplete: main or weather list is null/empty.");
                }
            } else {
                this.currentWeather = "Failed to fetch weather data.";
                logger.error("Failed to fetch weather data. Status: {}", response.getStatusCode());
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            logger.error("HTTP error fetching weather (check API key!): {} - {}", e.getStatusCode(), e.getMessage());
            this.currentWeather = "Weather unavailable (invalid API key).";
        } catch (Exception e) {
            logger.error("Error fetching weather: {}", e.getMessage());
            this.currentWeather = "Weather unavailable.";
        }
    }

    public String getCurrentWeather() {
        return currentWeather;
    }
}
