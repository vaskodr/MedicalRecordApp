package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.data.entity.models.Patient;
import com.nbu.medicalreport.dto.PatientDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByEgn(String egn);

    @Query("SELECT p FROM Patient p WHERE p.personalDoctor = :doctor")
    List<Patient> findPatientsByPersonalDoctor(@Param("doctor") Doctor doctor);
}
