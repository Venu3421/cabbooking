package com.example.rollbasedlogin.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.rollbasedlogin.model.Booking;
import com.example.rollbasedlogin.model.Driver;
import com.example.rollbasedlogin.repository.BookingRepository;
import com.example.rollbasedlogin.repository.DriverRepository;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private DriverRepository driverRepo;

    @GetMapping("/mytrips")
    public List<Booking> getDriverBookings(@RequestParam String email) {
        return this.bookingRepo.findByDriverEmail(email);
    }

    @PutMapping("/start-trip/{bookingId}")
    public ResponseEntity<String> startTrip(@PathVariable Long bookingId) {
        Optional<Booking> optional = this.bookingRepo.findById(bookingId);
        if (optional.isPresent()) {
            Booking booking = optional.get();
            booking.setStatus("IN PROGRESS");
            this.bookingRepo.save(booking);
            return ResponseEntity.ok("Trip started");
        } else {
            return ResponseEntity.status(404).body("Booking not found");
        }
    }

    @PutMapping("/complete-trip/{bookingId}")
    public ResponseEntity<String> completeTrip(@PathVariable Long bookingId) {
        Optional<Booking> optional = this.bookingRepo.findById(bookingId);
        if (optional.isPresent()) {
            Booking booking = optional.get();
            booking.setStatus("COMPLETED");
            this.bookingRepo.save(booking);

            // Make driver available again
            String driverEmail = booking.getDriverEmail();
            if (driverEmail != null) {
                Optional<Driver> driverOpt = this.driverRepo.findAll()
                        .stream()
                        .filter(d -> d.getEmail().equals(driverEmail))
                        .findFirst();

                driverOpt.ifPresent(driver -> {
                    driver.setAvailable(true);
                    this.driverRepo.save(driver);
                });
            }

            return ResponseEntity.ok("Trip marked as completed");

        } else {
            return ResponseEntity.status(404).body("Booking not found");
        }
    }

    @PutMapping("/toggle-availability")
    public ResponseEntity<String> toggleAvailability(@RequestParam String email, @RequestParam boolean available) {
        Optional<Driver> driverOpt = this.driverRepo.findAll()
                .stream()
                .filter(d -> d.getEmail().equals(email))
                .findFirst();

        if (driverOpt.isPresent()) {
            Driver driver = driverOpt.get();
            driver.setAvailable(available);
            this.driverRepo.save(driver);
            return ResponseEntity.ok(available ? "You are now ONLINE 🟢" : "You are now OFFLINE 🔴");
        }
        return ResponseEntity.status(404).body("Driver not found");
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> getDriverStatus(@RequestParam String email) {
        Optional<Driver> driverOpt = this.driverRepo.findAll()
                .stream()
                .filter(d -> d.getEmail().equals(email))
                .findFirst();

        return driverOpt.map(driver -> ResponseEntity.ok(driver.isAvailable()))
                        .orElseGet(() -> ResponseEntity.status(404).body(false));
    }

}
