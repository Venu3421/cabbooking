package com.example.rollbasedlogin.controller;



import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rollbasedlogin.model.LoginRequest;
import com.example.rollbasedlogin.model.User;
import com.example.rollbasedlogin.repository.UserRepository;
import com.example.rollbasedlogin.util.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")  // 🔥 This is important!
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<String> register( @RequestBody User user) 
    {
        if (this.userRepo.findByEmail(user.getEmail()).isPresent()) {
             return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            //   throw new RuntimeException("Email already exists");
        }

        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        this.userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOpt = this.userRepo.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email");
        }

        User user = userOpt.get();
        if (!this.passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        String token = this.jwtUtil.generateToken(user.getEmail(), user.getRole());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    @Value("${google.client.id}")
    private String googleClientId;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String tokenString = request.get("token");
        String roleFromRequest = request.get("role"); // Provided by Register page, null from Login page

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken = verifier.verify(tokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<User> userOpt = this.userRepo.findByEmail(email);
                User user;
                if (userOpt.isEmpty()) {
                    if (roleFromRequest == null || roleFromRequest.isBlank()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Account not found. Please sign up and select a portal role first.");
                    }
                    // Auto-register new Google user
                    user = new User();
                    user.setEmail(email);
                    user.setUsername(name != null ? name : email.split("@")[0]);
                    // Generate a random unused password since they authenticate via Google
                    user.setPassword(this.passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setRole(roleFromRequest);
                    this.userRepo.save(user);
                } else {
                    user = userOpt.get();
                }

                // Issue our system's JWT
                String token = this.jwtUtil.generateToken(user.getEmail(), user.getRole());
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
            }
        } catch (java.security.GeneralSecurityException | java.io.IOException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Email and new password are required");
        }

        Optional<User> userOpt = this.userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        user.setPassword(this.passwordEncoder.encode(newPassword));
        this.userRepo.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }
}
