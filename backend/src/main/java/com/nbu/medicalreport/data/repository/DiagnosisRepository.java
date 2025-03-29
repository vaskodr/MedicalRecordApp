package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    @Query("SELECT d.diagnosis AS diagnosis, COUNT(DISTINCT e.patient.id) AS patientCount " +
            "FROM Diagnosis d " +
            "JOIN d.examinations e " +
            "GROUP BY d.diagnosis " +
            "ORDER BY patientCount DESC")
    List<Map<String, Object>> findDiagnosisStatistics();
}
