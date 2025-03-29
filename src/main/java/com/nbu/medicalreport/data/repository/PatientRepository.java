package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.data.entity.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByEgn(String egn);

    @Query("SELECT new com.nbu.medicalreport.dto.records.PatientDTO(p.firstName, p.lastName, p.egn) " +
            "FROM Patient p " +
            "WHERE p.personalDoctor = :doctor")
    List<com.nbu.medicalreport.dto.records.PatientDTO> findPatientsByPersonalDoctor(@Param("doctor") Doctor doctor);
}
