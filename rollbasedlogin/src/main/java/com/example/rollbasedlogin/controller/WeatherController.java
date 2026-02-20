package com.example.rollbasedlogin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rollbasedlogin.service.WeatherService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/weather")
    public String getWeather(@org.springframework.web.bind.annotation.RequestParam(required = false) Double lat,
                             @org.springframework.web.bind.annotation.RequestParam(required = false) Double lon) {
        if (lat != null && lon != null) {
            return weatherService.getWeatherByCoordinates(lat, lon);
        }
        return weatherService.getCurrentWeather();
    }
}
