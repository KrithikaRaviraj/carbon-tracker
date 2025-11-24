package com.example.backend.repository;

import com.example.backend.entity.Activity;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserOrderByDateDesc(User user);
    
    @Query("SELECT a.date, SUM(a.carbonFootprint) FROM Activity a WHERE a.user = ?1 GROUP BY a.date ORDER BY a.date")
    List<Object[]> findDailyTotalsByUser(User user);
    
    @Query("SELECT a.category, SUM(a.carbonFootprint) FROM Activity a WHERE a.user = ?1 GROUP BY a.category")
    List<Object[]> findCategoryTotalsByUser(User user);
}