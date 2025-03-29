package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.*;
import com.nbu.medicalreport.dto.records.DiagnosisFrequencyDTO;
import com.nbu.medicalreport.dto.records.DoctorVisitCountDTO;
import com.nbu.medicalreport.dto.records.PatientsWithDiagnosisDTO;

import java.util.List;

public interface ExaminationService {
    List<ExaminationDTO> getExaminations();
    ExaminationDTO getExaminationById(long id);
    ExaminationDTO createExamination(long doctorId, long patientId, CreateExaminationDTO createExaminationDTO);
    ExaminationDTO updateExamination(long id, UpdateExaminationDTO updateExaminationDTO);
    void deleteExamination(long id);



    List<ExaminationDTO> getExaminationsByPatientId(long patientId);
    List<ExaminationDTO> getExaminationsByDoctorId(long doctorId);

    List<DoctorVisitCountDTO> getVisitCountPerDoctor();
    List<PatientsWithDiagnosisDTO> getPatientsByDiagnosis(String diagnosisName);
    List<DiagnosisFrequencyDTO> getMostFrequentDiagnoses();

    // TODO:

    //ExaminationDTO issueAnExamination(long doctorId, CreateExaminationRequestDTO requestDTO);
    //void issueASickLeaveList();

}
