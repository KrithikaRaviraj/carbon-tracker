package com.example.backend.config;

import com.example.backend.entity.Activity;
import com.example.backend.entity.User;
import com.example.backend.repository.ActivityRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Only create test data if no users exist
        if (userRepository.count() == 0) {
            User user = new User();
            user.setEmail("test@example.com");
            user.setPassword(passwordEncoder.encode("password"));
            user.setName("Test User");
            userRepository.save(user);
            
            // Add sample activities
            Activity a1 = new Activity();
            a1.setUser(user);
            a1.setCategory("Transportation");
            a1.setDescription("Car trip");
            a1.setCarbonFootprint(5.2);
            a1.setDate(LocalDate.now().minusDays(2));
            activityRepository.save(a1);
            
            Activity a2 = new Activity();
            a2.setUser(user);
            a2.setCategory("Energy");
            a2.setDescription("Electricity usage");
            a2.setCarbonFootprint(3.8);
            a2.setDate(LocalDate.now().minusDays(1));
            activityRepository.save(a2);
            
            Activity a3 = new Activity();
            a3.setUser(user);
            a3.setCategory("Transportation");
            a3.setDescription("Bus trip");
            a3.setCarbonFootprint(1.5);
            a3.setDate(LocalDate.now());
            activityRepository.save(a3);
        }
    }
}