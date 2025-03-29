package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.CreateOrUpdateSpecializationDTO;
import com.nbu.medicalreport.dto.SpecializationDTO;

import java.util.List;

public interface SpecializationService {
    List<SpecializationDTO> getSpecializations();
    SpecializationDTO getSpecializationById(long id);
    SpecializationDTO createSpecialization(CreateOrUpdateSpecializationDTO createSpecializationDTO);
    SpecializationDTO updateSpecialization(long id, CreateOrUpdateSpecializationDTO updateSpecializationDTO);
    void deleteSpecialization(long id);
}
