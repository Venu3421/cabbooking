package com.example.rollbasedlogin.controller;

import java.time.LocalDate;
import java.util.List;

import com.example.rollbasedlogin.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.rollbasedlogin.model.Booking;
import com.example.rollbasedlogin.model.Driver;
import com.example.rollbasedlogin.repository.BookingRepository;
import com.example.rollbasedlogin.repository.DriverRepository;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "*")
public class HRController {

    @Autowired
    private DriverRepository driverRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private SmsService smsService;

    @PostMapping("/book")
    public String bookCab(@RequestBody Booking booking) {
        booking.setBookingDate(LocalDate.now().toString());
        booking.setStatus("BOOKED");

        // 🔍 Try to auto-assign driver
        List<Driver> drivers = this.driverRepo.findByCabTypeAndAvailable(booking.getCabType(), true);
        if (!drivers.isEmpty()) {
            Driver assignedDriver = drivers.get(0); // Pick first available
            booking.setDriverEmail(assignedDriver.getEmail());
            booking.setStatus("ASSIGNED");

            // Mark driver as unavailable
            assignedDriver.setAvailable(false);
            this.driverRepo.save(assignedDriver);
        }

        this.bookingRepo.save(booking);

        // Send SMS to Employee
        if (booking.getEmployeeMobileNumber() != null && !booking.getEmployeeMobileNumber().isEmpty()) {
            String employeeMsg = String.format("Cab Confirmed! 🚕 Your ride is scheduled for %s at %s. Your driver will reach the pickup location shortly, please be ready!",
                    booking.getPickupTime(), booking.getPickup());
            smsService.sendSms(booking.getEmployeeMobileNumber(), employeeMsg);
        }

        // Send SMS to Driver
        if ("ASSIGNED".equals(booking.getStatus()) && booking.getDriverEmail() != null) {
            Driver driver = this.driverRepo.findByEmail(booking.getDriverEmail());
            if (driver != null && driver.getMobileNumber() != null && !driver.getMobileNumber().isEmpty()) {
                String driverMsg = String.format("🚕 NEW RIDE ASSIGNED !\nRider: %s\nPickup: %s\nTime: %s\nPhone: %s",
                        booking.getEmployeeName(), booking.getPickup(), booking.getPickupTime(),
                        booking.getEmployeeMobileNumber() != null ? booking.getEmployeeMobileNumber() : "N/A");
                smsService.sendSms(driver.getMobileNumber(), driverMsg);
            }
        }

        return "Booking Successful!";
    }

    @GetMapping("/mybookings")
    public List<Booking> getHRBookings(@RequestParam String email) {
        return this.bookingRepo.findByHrEmail(email);
    }

    @PostMapping("/cancel/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId) {
        Booking booking = this.bookingRepo.findById(bookingId).orElse(null);
        if (booking == null) {
            return "Booking not found";
        }
        if ("COMPLETED".equals(booking.getStatus()) || "IN PROGRESS".equals(booking.getStatus())) {
            return "Cannot cancel a trip in progress or completed";
        }

        booking.setStatus("CANCELLED");

        // If driver was assigned, make them available
        if (booking.getDriverEmail() != null) {
            Driver driver = this.driverRepo.findByEmail(booking.getDriverEmail()); // Assuming findByEmail exists or use
                                                                                   // stream
            if (driver == null) {
                // Fallback if no direct findByEmail
                driver = this.driverRepo.findAll().stream()
                        .filter(d -> d.getEmail().equals(booking.getDriverEmail()))
                        .findFirst().orElse(null);
            }

            if (driver != null) {
                driver.setAvailable(true);
                this.driverRepo.save(driver);
            }
        }

        this.bookingRepo.save(booking);
        return "Booking Cancelled";
    }

}
