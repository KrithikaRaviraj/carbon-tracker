package com.example.backend.controller;

import com.example.backend.entity.Goal;
import com.example.backend.entity.User;
import com.example.backend.repository.GoalRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {
    
    @Autowired
    private GoalRepository goalRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> setGoals(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            System.out.println("Set goals request: " + request);
            System.out.println("Auth: " + (auth != null ? auth.getName() : "null"));
            
            // For testing - use test user if no auth
            User user;
            if (auth == null) {
                user = userRepository.findByEmail("test@example.com").orElse(null);
            } else {
                user = userRepository.findByEmail(auth.getName()).orElse(null);
            }
            
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("message", "User not found"));
            }
            
            Goal goal = goalRepository.findByUser(user).orElse(new Goal());
            goal.setUser(user);
            goal.setDailyGoal(Double.valueOf(request.get("dailyGoal").toString()));
            goal.setMonthlyGoal(Double.valueOf(request.get("monthlyGoal").toString()));
            
            goalRepository.save(goal);
            return ResponseEntity.ok(Map.of("message", "Goals updated"));
        } catch (Exception e) {
            System.out.println("Error setting goals: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getGoals(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        Goal goal = goalRepository.findByUser(user).orElse(null);
        if (goal == null) {
            return ResponseEntity.ok(Map.of("dailyGoal", 0.0, "monthlyGoal", 0.0));
        }
        
        return ResponseEntity.ok(Map.of(
            "dailyGoal", goal.getDailyGoal(),
            "monthlyGoal", goal.getMonthlyGoal()
        ));
    }
}