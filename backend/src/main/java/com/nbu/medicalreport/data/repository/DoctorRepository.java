package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.dto.records.GPPatientCountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

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



}
