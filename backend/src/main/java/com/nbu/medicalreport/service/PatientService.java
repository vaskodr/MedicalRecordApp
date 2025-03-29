package com.nbu.medicalreport.service;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.dto.CreatePatientDTO;
import com.nbu.medicalreport.dto.PatientDTO;
import com.nbu.medicalreport.dto.UpdatePatientDTO;

import java.util.List;

public interface PatientService {
    List<PatientDTO> getPatients();
    PatientDTO getPatientById(long id);
    PatientDTO createPatient(CreatePatientDTO createPatientDTO);
    PatientDTO updatePatient(long id, UpdatePatientDTO patient);
    void deletePatient(long id);

    PatientDTO getPatientByEgn(String egn);

    List<com.nbu.medicalreport.dto.records.PatientDTO> getPatientsByDoctor(long doctorId);

}
