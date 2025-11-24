package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.repository.ActivityRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        long totalActivities = activityRepository.findByUserOrderByDateDesc(user).size();
        double totalEmissions = activityRepository.findByUserOrderByDateDesc(user)
                .stream().mapToDouble(a -> a.getCarbonFootprint()).sum();
        
        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "name", user.getName() != null ? user.getName() : "",
            "createdAt", user.getCreatedAt().toString(),
            "totalActivities", totalActivities,
            "totalEmissions", totalEmissions
        ));
    }
    
    @PutMapping("/name")
    public ResponseEntity<?> updateName(@RequestBody Map<String, String> request, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        user.setName(request.get("name"));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Name updated"));
    }
    
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password is required"));
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Password changed", "logout", true));
    }
}