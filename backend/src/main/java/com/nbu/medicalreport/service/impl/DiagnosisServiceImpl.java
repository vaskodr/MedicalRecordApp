package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.Diagnosis;
import com.nbu.medicalreport.data.entity.models.Examination;
import com.nbu.medicalreport.data.entity.models.Role;
import com.nbu.medicalreport.data.entity.models.User;
import com.nbu.medicalreport.data.repository.DiagnosisRepository;
import com.nbu.medicalreport.dto.CreateDiagnosisDTO;
import com.nbu.medicalreport.dto.DiagnosisDTO;
import com.nbu.medicalreport.dto.UpdateDiagnosisDTO;
import com.nbu.medicalreport.dto.UserDTO;
import com.nbu.medicalreport.service.DiagnosisService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import jdk.jshell.Diag;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiagnosisServiceImpl implements DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final MapperConfig mapperConfig;

    @Override
    public List<DiagnosisDTO> getDiagnoses() {
        List<Diagnosis> diagnoses = diagnosisRepository.findAll();
        return diagnoses.stream()
                .map(this::convertToDiagnosisDTO)
                .toList();
    }

    @Override
    public DiagnosisDTO getDiagnosisById(long id) {
        Optional<Diagnosis> diagnosis = diagnosisRepository.findById(id);
        return diagnosis.map(this::convertToDiagnosisDTO)
                .orElseThrow(
                        () -> new IllegalArgumentException("Diagnosis not found")
                );
    }

    @Override
    public DiagnosisDTO createDiagnosis(CreateDiagnosisDTO createDiagnosisDTO) {
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setDiagnosis(createDiagnosisDTO.getDiagnosis());
        diagnosis.setDescription(createDiagnosisDTO.getDescription());
        this.diagnosisRepository.save(diagnosis);
        return convertToDiagnosisDTO(diagnosis);
    }

    @Override
    public DiagnosisDTO updateDiagnosis(long id, UpdateDiagnosisDTO updateDiagnosisDTO) {
        Diagnosis diagnosis = this.diagnosisRepository.findById(id)
                .orElse(null);

        if (null != updateDiagnosisDTO.getDiagnosis()) {
            diagnosis.setDiagnosis(updateDiagnosisDTO.getDiagnosis());
        }
        if (null != updateDiagnosisDTO.getDescription()) {
            diagnosis.setDescription(updateDiagnosisDTO.getDescription());
        }

        diagnosisRepository.save(diagnosis);

        return convertToDiagnosisDTO(diagnosis);
    }

    @Override
    public void deleteDiagnosis(long id) {
        this.diagnosisRepository.deleteById(id);
    }

    // QUERIES

    @Override
    public List<Map<String, Object>> getDiagnosisStatistics() {
        return this.diagnosisRepository.findDiagnosisStatistics();
    }

    // Private Functions

    private DiagnosisDTO convertToDiagnosisDTO(Diagnosis diagnosis) {
        DiagnosisDTO dto = mapperConfig.modelMapper().map(diagnosis, DiagnosisDTO.class);

        List<Long> examinationIds = diagnosis.getExaminations().stream()
                .map(Examination::getId)
                .toList();

        dto.setExaminationIds(examinationIds);

        return dto;
    }
}
