package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.repository.ActivityRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyAnalytics(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        List<Object[]> results = activityRepository.findDailyTotalsByUser(user);
        List<Map<String, Object>> data = results.stream()
                .map(row -> Map.of("date", row[0].toString(), "total", row[1]))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("data", data));
    }
    
    @GetMapping("/category")
    public ResponseEntity<?> getCategoryAnalytics(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        List<Object[]> results = activityRepository.findCategoryTotalsByUser(user);
        Map<String, Double> data = new HashMap<>();
        results.forEach(row -> data.put((String) row[0], (Double) row[1]));
        
        return ResponseEntity.ok(data);
    }
}