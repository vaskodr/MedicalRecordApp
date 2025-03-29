package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.data.entity.models.Role;
import com.nbu.medicalreport.data.entity.models.Specialization;
import com.nbu.medicalreport.data.entity.models.User;
import com.nbu.medicalreport.data.repository.SpecializationRepository;
import com.nbu.medicalreport.dto.CreateOrUpdateSpecializationDTO;
import com.nbu.medicalreport.dto.SpecializationDTO;
import com.nbu.medicalreport.dto.UserDTO;
import com.nbu.medicalreport.service.SpecializationService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SpecializationServiceImpl implements SpecializationService {
    private final MapperConfig mapperConfig;
    private final SpecializationRepository specializationRepository;

    @Override
    public List<SpecializationDTO> getSpecializations() {
        List<Specialization> specializations = specializationRepository.findAll();
        return specializations.stream()
                .map(this::convertToSpecializationDTO)
                .toList();
    }

    @Override
    public SpecializationDTO getSpecializationById(long id) {
        Optional<Specialization> specialization = specializationRepository.findById(id);
        return specialization.map(this::convertToSpecializationDTO)
                .orElseThrow(
                        () -> new IllegalArgumentException("Specialization with id " + id + " not found")
                );
    }

    @Override
    public SpecializationDTO createSpecialization(CreateOrUpdateSpecializationDTO createSpecializationDTO) {
        Specialization specialization = new Specialization();
        specialization.setName(createSpecializationDTO.getName());
        this.specializationRepository.save(specialization);
        return convertToSpecializationDTO(specialization);
    }

    @Override
    public SpecializationDTO updateSpecialization(long id, CreateOrUpdateSpecializationDTO updateSpecializationDTO) {
        Specialization specialization = this.specializationRepository.findById(id).orElse(null);
        if (specialization != null) {
            if (updateSpecializationDTO.getName() != null) {
                specialization.setName(updateSpecializationDTO.getName());
            }
            specialization = this.specializationRepository.save(specialization);
        }
        return convertToSpecializationDTO(specialization);
    }

    @Override
    public void deleteSpecialization(long id) {
        this.specializationRepository.deleteById(id);
    }


    private SpecializationDTO convertToSpecializationDTO(Specialization specialization) {
        SpecializationDTO dto = mapperConfig.modelMapper().map(specialization, SpecializationDTO.class);

        List<Long> doctorIds = specialization.getDoctors().stream()
                .map(Doctor::getId)
                .toList();

        dto.setDoctorIds(doctorIds);

        return dto;
    }

}
