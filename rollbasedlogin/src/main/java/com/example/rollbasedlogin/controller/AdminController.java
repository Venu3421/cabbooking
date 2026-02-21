package com.example.rollbasedlogin.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.rollbasedlogin.model.Booking;
import com.example.rollbasedlogin.model.Driver;
import com.example.rollbasedlogin.model.User;
import com.example.rollbasedlogin.repository.BookingRepository;
import com.example.rollbasedlogin.repository.DriverRepository;
import com.example.rollbasedlogin.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepo;

    @Value("${timezonedb.api.key}")
    private String timeZoneDbApiKey;

    @GetMapping("/time")
    public ResponseEntity<?> getServerTime(@org.springframework.web.bind.annotation.RequestParam(defaultValue = "Europe/London") String zone) {
        String url = "http://api.timezonedb.com/v2.1/get-time-zone?key=" + timeZoneDbApiKey + "&format=json&by=zone&zone=" + zone;
        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (org.springframework.web.client.RestClientException e) {
            return ResponseEntity.status(500).body("{\"error\": \"Error fetching time from TimeZoneDB\"}");
        }
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    @Autowired
    private UserRepository userRepo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping("/hrs")
    public List<User> getAllHRs() {
        return userRepo.findByRole("hr");
    }

    @PostMapping("/add-hr")
    public ResponseEntity<String> addHR(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body("Email already exists");
        }
        user.setRole("hr");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("HR added successfully");
    }

    @PutMapping("/edit-hr/{id}")
    public ResponseEntity<String> editHR(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("HR not found");
        }
        User existingUser = userOpt.get();
        if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        userRepo.save(existingUser);
        return ResponseEntity.ok("HR updated successfully");
    }

    @DeleteMapping("/delete-hr/{id}")
    public ResponseEntity<String> deleteHR(@PathVariable Long id) {
        if (!userRepo.existsById(id)) return ResponseEntity.status(404).body("HR not found");
        userRepo.deleteById(id);
        return ResponseEntity.ok("HR deleted successfully");
    }

    @Autowired
private DriverRepository driverRepo;

@GetMapping("/view-drivers")
public List<Driver> getAllDrivers() {
    return driverRepo.findAll();
}



@PostMapping("/add-driver")
public ResponseEntity<String> addDriver(@RequestBody Driver driver) {
    driver.setAvailable(true); // Set availability true by default
    driverRepo.save(driver);
    return ResponseEntity.ok("Driver added successfully");
}

@PutMapping("/edit-driver/{id}")
public ResponseEntity<String> editDriver(@PathVariable Long id, @RequestBody Driver updatedDriver) {
    Optional<Driver> driverOpt = driverRepo.findById(id);
    if (driverOpt.isEmpty()) {
        return ResponseEntity.status(404).body("Driver not found");
    }

    Driver existingDriver = driverOpt.get();
    
    // Update allowed fields
    if (updatedDriver.getName() != null) existingDriver.setName(updatedDriver.getName());
    if (updatedDriver.getCabType() != null) existingDriver.setCabType(updatedDriver.getCabType());
    if (updatedDriver.getMobileNumber() != null) existingDriver.setMobileNumber(updatedDriver.getMobileNumber());
    // Note: Emial is usually not editable without further validation, but skipping that complexity here.
    if (updatedDriver.getEmail() != null) existingDriver.setEmail(updatedDriver.getEmail());

    driverRepo.save(existingDriver);
    return ResponseEntity.ok("Driver updated successfully");
}

@DeleteMapping("/delete-driver/{id}")
public ResponseEntity<String> deleteDriver(@PathVariable Long id) {
    if (!driverRepo.existsById(id)) return ResponseEntity.status(404).body("Driver not found");
    driverRepo.deleteById(id);
    return ResponseEntity.ok("Driver deleted successfully");
}



}
