package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Examination;
import com.nbu.medicalreport.dto.records.DiagnosisFrequencyDTO;
import com.nbu.medicalreport.dto.records.DoctorVisitCountDTO;
import com.nbu.medicalreport.dto.records.PatientsWithDiagnosisDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    List<Examination> getExaminationsByPatientId(Long patientId);
    List<Examination> getExaminationsByDoctorId(Long doctorId);


    @Query("SELECT new com.nbu.medicalreport.dto.records.DoctorVisitCountDTO(e.doctor.doctorIdentity, COUNT(e)) " +
            "FROM Examination e " +
            "GROUP BY e.doctor.doctorIdentity " +
            "ORDER BY COUNT(e) DESC")
    List<DoctorVisitCountDTO> findVisitCountPerDoctor();

    @Query("SELECT DISTINCT new com.nbu.medicalreport.dto.records.PatientsWithDiagnosisDTO(p.firstName, p.lastName, p.egn) " +
            "FROM Examination e " +
            "JOIN e.patient p " +
            "JOIN e.diagnoses d " +
            "WHERE d.diagnosis = :diagnosisName")
    List<PatientsWithDiagnosisDTO> findPatientsByDiagnosis(@Param("diagnosisName") String diagnosisName);

    @Query("SELECT new com.nbu.medicalreport.dto.records.DiagnosisFrequencyDTO(d.diagnosis, COUNT(d)) " +
            "FROM Examination e " +
            "JOIN e.diagnoses d " +
            "GROUP BY d.diagnosis " +
            "ORDER BY COUNT(d) DESC")
    List<DiagnosisFrequencyDTO> findMostFrequentDiagnoses();

    @Query("SELECT e FROM Examination e " +
            "WHERE e.examinationDate BETWEEN :startDate AND :endDate " +
            "ORDER BY e.examinationDate DESC, e.doctor.doctorIdentity")
    List<Examination> findExaminationsByDateRange(@Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT e FROM Examination e " +
            "WHERE e.doctor.id = :doctorId " +
            "AND e.examinationDate BETWEEN :startDate AND :endDate " +
            "ORDER BY e.examinationDate DESC")
    List<Examination> findExaminationsByDoctorAndDateRange(@Param("doctorId") Long doctorId,
                                                           @Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate);

}
