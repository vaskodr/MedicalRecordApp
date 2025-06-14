package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.dto.records.DoctorSickLeaveResponse;
import com.nbu.medicalreport.dto.records.GPPatientCountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Doctor findByDoctorIdentity(String doctorIdentity);

    @Query("SELECT new com.nbu.medicalreport.dto.records.GPPatientCountDTO(d.doctorIdentity, COUNT(p.id)) " +
            "FROM Doctor d " +
            "LEFT JOIN d.registeredPatients p " +
            "WHERE d.isGP = TRUE " +
            "GROUP BY d.doctorIdentity " +
            "ORDER BY COUNT(p.id) DESC")
    List<GPPatientCountDTO> findPatientCountByGPs();

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.personalDoctor.isGP = true")
    long findTotalPatientCountByGPs();

    List<Doctor> findByIsGPTrue();

    @Query("SELECT new com.nbu.medicalreport.dto.records.DoctorSickLeaveResponse(" +
            "d.id, d.doctorIdentity, d.firstName, d.lastName, COUNT(s)) " +
            "FROM SickLeave s " +
            "JOIN s.examination e " +
            "JOIN e.doctor d " +
            "GROUP BY d.id, d.doctorIdentity, d.firstName, d.lastName " +
            "ORDER BY COUNT(s) DESC " +
            "LIMIT 3")
    List<DoctorSickLeaveResponse> findDoctorsWithMostSickLeaves();



}
