package com.example.rollbasedlogin.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rollbasedlogin.model.Booking;
import com.example.rollbasedlogin.model.Driver;
import com.example.rollbasedlogin.repository.BookingRepository;
import com.example.rollbasedlogin.repository.DriverRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepo;

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
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



}
