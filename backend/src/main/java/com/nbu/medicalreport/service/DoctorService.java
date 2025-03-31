package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.CreateDoctorDTO;
import com.nbu.medicalreport.dto.DoctorDTO;
import com.nbu.medicalreport.dto.UpdateDoctorDTO;
import com.nbu.medicalreport.dto.records.GPPatientCountDTO;
import org.hibernate.sql.Update;

import java.util.List;

public interface DoctorService {
    List<DoctorDTO> getDoctors();
    DoctorDTO getDoctorById(long id);
    DoctorDTO createDoctor(CreateDoctorDTO createDoctorDTO);
    DoctorDTO updateDoctor(long id, UpdateDoctorDTO updateDoctorDTO);
    void deleteDoctor(long id);

    List<GPPatientCountDTO> getPatientCountByGPs();
    long getTotalPatientCountByGPs();
    List<DoctorDTO> getGPDoctors();

}
