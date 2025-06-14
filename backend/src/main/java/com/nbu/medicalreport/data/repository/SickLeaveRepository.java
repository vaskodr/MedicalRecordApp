package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.SickLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface SickLeaveRepository extends JpaRepository<SickLeave, Long> {

    @Query("SELECT MONTH(s.startDate) as month, COUNT(s) as count " +
            "FROM SickLeave s " +
            "WHERE YEAR(s.startDate) = :year " +
            "GROUP BY MONTH(s.startDate) " +
            "ORDER BY count DESC " +
            "LIMIT 1")
    Map<String, Object> findMonthWithMostSickLeavesInYear(@Param("year") int year);

}