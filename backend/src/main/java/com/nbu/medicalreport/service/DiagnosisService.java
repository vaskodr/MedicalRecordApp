package com.nbu.medicalreport.service;

import com.nbu.medicalreport.data.entity.models.Diagnosis;
import com.nbu.medicalreport.dto.CreateDiagnosisDTO;
import com.nbu.medicalreport.dto.DiagnosisDTO;
import com.nbu.medicalreport.dto.UpdateDiagnosisDTO;

import java.util.List;
import java.util.Map;

public interface DiagnosisService {
    List<DiagnosisDTO> getDiagnoses();
    DiagnosisDTO getDiagnosisById(long id);
    DiagnosisDTO createDiagnosis(CreateDiagnosisDTO createDiagnosisDTO);
    DiagnosisDTO updateDiagnosis(long id, UpdateDiagnosisDTO updateDiagnosisDTO);
    void deleteDiagnosis(long id);

    List<Map<String, Object>> getDiagnosisStatistics();
}
