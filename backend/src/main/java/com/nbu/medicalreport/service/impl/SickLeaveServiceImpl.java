package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.*;
import com.nbu.medicalreport.data.repository.ExaminationRepository;
import com.nbu.medicalreport.data.repository.SickLeaveRepository;
import com.nbu.medicalreport.dto.CreateSickLeaveDTO;
import com.nbu.medicalreport.dto.SickLeaveDTO;
import com.nbu.medicalreport.dto.UpdateSickLeaveDTO;
import com.nbu.medicalreport.service.SickLeaveService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SickLeaveServiceImpl implements SickLeaveService {

    private final MapperConfig mapperConfig;
    private final ExaminationRepository examinationRepository;
    private final SickLeaveRepository sickLeaveRepository;

    @Override
    public List<SickLeaveDTO> getSickLeaves() {
        List<SickLeave> sickLeaves = sickLeaveRepository.findAll();
        return sickLeaves.stream()
                .map(this::convertToSickLeaveDTO)
                .toList();
    }

    @Override
    public SickLeaveDTO getSickLeaveById(long id) {
        Optional<SickLeave> sickLeave = this.sickLeaveRepository.findById(id);
        return sickLeave.map(this::convertToSickLeaveDTO).orElseThrow(
                () -> new IllegalArgumentException("Sick Leave Not Found")
        );
    }

    @Override
    public SickLeaveDTO createSickLeave(long examinationId, CreateSickLeaveDTO createSickLeaveDTO) {

        Examination examination = examinationRepository.findById(examinationId).orElseThrow(
                () -> new IllegalArgumentException("Examination Not Found")
        );

        SickLeave sickLeave = new SickLeave();
        sickLeave.setStartDate(createSickLeaveDTO.getStartDate());
        sickLeave.setEndDate(createSickLeaveDTO.getEndDate());
        sickLeave.setExamination(examination);


        sickLeaveRepository.save(sickLeave);

        return convertToSickLeaveDTO(sickLeave);

    }

    @Override
    public SickLeaveDTO updateSickLeave(long id, UpdateSickLeaveDTO updateSickLeaveDTO) {
        SickLeave sickLeave = sickLeaveRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Sick leave Not Found")
        );

        if (updateSickLeaveDTO.getStartDate() != null) {
            sickLeave.setStartDate(updateSickLeaveDTO.getStartDate());
        }
        if (updateSickLeaveDTO.getEndDate() != null) {
            sickLeave.setEndDate(updateSickLeaveDTO.getEndDate());
        }
        if (updateSickLeaveDTO.getNote() != null) {
            sickLeave.setNote(updateSickLeaveDTO.getNote());
        }

        sickLeaveRepository.save(sickLeave);

        return convertToSickLeaveDTO(sickLeave);
    }

    @Override
    public void deleteSickLeave(long id) {
        this.sickLeaveRepository.deleteById(id);
    }

    private SickLeaveDTO convertToSickLeaveDTO(SickLeave sickLeave) {
        SickLeaveDTO dto = mapperConfig.modelMapper().map(sickLeave, SickLeaveDTO.class);

        long examinationId = sickLeave.getExamination().getId();
        dto.setExaminationId(examinationId);

        return dto;
    }
}
