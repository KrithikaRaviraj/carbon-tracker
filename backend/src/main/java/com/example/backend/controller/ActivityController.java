package com.example.backend.controller;

import com.example.backend.entity.Activity;
import com.example.backend.entity.User;
import com.example.backend.repository.ActivityRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> addActivity(@RequestBody Map<String, Object> request, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        Activity activity = new Activity();
        activity.setUser(user);
        activity.setCategory((String) request.get("category"));
        activity.setDescription((String) request.get("description"));
        activity.setCarbonFootprint(Double.valueOf(request.get("carbonFootprint").toString()));
        activity.setDate(LocalDate.parse((String) request.get("date")));
        
        activityRepository.save(activity);
        return ResponseEntity.ok(Map.of("message", "Activity added"));
    }
    
    @GetMapping
    public ResponseEntity<List<Activity>> getActivities(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        return ResponseEntity.ok(activityRepository.findByUserOrderByDateDesc(user));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody Map<String, Object> request, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).build();
            }
            
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("message", "User not found"));
            }
            
            Activity activity = activityRepository.findById(id).orElse(null);
            if (activity == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Activity not found"));
            }
            
            if (!activity.getUser().equals(user)) {
                return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
            }
            
            activity.setCategory((String) request.get("category"));
            activity.setDescription((String) request.get("description"));
            activity.setCarbonFootprint(Double.valueOf(request.get("carbonFootprint").toString()));
            activity.setDate(LocalDate.parse((String) request.get("date")));
            
            activityRepository.save(activity);
            return ResponseEntity.ok(Map.of("message", "Activity updated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Update failed"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();
        
        Activity activity = activityRepository.findById(id).orElse(null);
        if (activity == null || !activity.getUser().equals(user)) {
            return ResponseEntity.badRequest().build();
        }
        
        activityRepository.delete(activity);
        return ResponseEntity.ok(Map.of("message", "Activity deleted"));
    }
}