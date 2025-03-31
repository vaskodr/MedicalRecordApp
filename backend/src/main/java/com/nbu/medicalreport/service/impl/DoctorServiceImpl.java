package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.*;
import com.nbu.medicalreport.data.repository.DoctorRepository;
import com.nbu.medicalreport.data.repository.RoleRepository;
import com.nbu.medicalreport.data.repository.SpecializationRepository;
import com.nbu.medicalreport.dto.CreateDoctorDTO;
import com.nbu.medicalreport.dto.DoctorDTO;
import com.nbu.medicalreport.dto.UpdateDoctorDTO;
import com.nbu.medicalreport.dto.records.GPPatientCountDTO;
import com.nbu.medicalreport.service.DoctorService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final RoleRepository roleRepository;
    private final MapperConfig mapperConfig;
    private final DoctorRepository doctorRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<DoctorDTO> getDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(this::convertToDoctorDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getGPDoctors() {
        List<Doctor> gpDoctors = doctorRepository.findByIsGPTrue();
        return gpDoctors.stream()
                .map(this::convertToDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.map(this::convertToDoctorDTO).orElseThrow(
                () -> new IllegalArgumentException("Doctor not found")
        );
    }

    @Override
    @Transactional
    public DoctorDTO createDoctor(CreateDoctorDTO createDoctorDTO) {
        Doctor doctor = new Doctor();

        doctor.setDoctorIdentity(generateDoctorId());

        Role roleDoctor = this.roleRepository.findByAuthority("ROLE_DOCTOR");
        if (roleDoctor == null) {
            throw new IllegalArgumentException("Role 'ROLE_DOCTOR' not found");
        }

        mapperConfig.modelMapper().map(createDoctorDTO, doctor);

        doctor.setPassword(passwordEncoder.encode(createDoctorDTO.getPassword()));
        Set<Role> roles = new HashSet<>();
        roles.add(roleDoctor);
        doctor.setAuthorities(roles);
        if (createDoctorDTO.getSpecializationIds() != null) {
            if (!createDoctorDTO.getSpecializationIds().isEmpty()) {
                System.out.println("Specialization IDs: " + createDoctorDTO.getSpecializationIds());

                List<Specialization> specializations = createDoctorDTO.getSpecializationIds().stream()
                        .map(id -> specializationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Specialization with ID " + id + " not found")))
                        .collect(Collectors.toList());

                if (createDoctorDTO.isGP()) {
                    Specialization gpSpecialization = specializationRepository.findByName("GP");
                    if (gpSpecialization != null) {
                        specializations.add(gpSpecialization);
                    } else {
                        throw new IllegalArgumentException("GP specialization not found");
                    }
                }

                doctor.setSpecializations(new HashSet<>(specializations));
            } else {
                System.out.println("No specializations provided.");
            }
        } else {
            System.out.println("Specialization IDs are null.");
        }
        doctorRepository.save(doctor);
        return convertToDoctorDTO(doctor);
    }


    @Override
    public DoctorDTO updateDoctor(long id, UpdateDoctorDTO updateDoctorDTO) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Doctor not found")
        );

        // Map only the updated fields to the existing doctor object
        mapperConfig.modelMapper().getConfiguration().setSkipNullEnabled(true);
        mapperConfig.modelMapper().map(updateDoctorDTO, doctor);

        // Save the updated doctor
        doctorRepository.save(doctor);

        return convertToDoctorDTO(doctor);
    }

    @Override
    public void deleteDoctor(long id) {
        this.doctorRepository.deleteById(id);
    }

    @Override
    public List<GPPatientCountDTO> getPatientCountByGPs() {
        return doctorRepository.findPatientCountByGPs();
    }

    @Override
    public long getTotalPatientCountByGPs() {
        return doctorRepository.findTotalPatientCountByGPs();
    }


    private String generateDoctorId() {
        long count = doctorRepository.count();
        return String.format("DOC%03d", count + 1);
    }

    private DoctorDTO convertToDoctorDTO(Doctor doctor) {
        DoctorDTO dto = mapperConfig.modelMapper().map(doctor, DoctorDTO.class);

        List<Long> authorityIds = doctor.getAuthorities().stream()
                .map(Role::getId)
                .toList();
        List<Long> specializationIds = doctor.getSpecializations().stream()
                .map(Specialization::getId)
                .toList();
        List<Long> patientIds = doctor.getRegisteredPatients().stream()
                .map(Patient::getId)
                .toList();
        List<Long> examinationIds = doctor.getExaminations().stream()
                .map(Examination::getId)
                .toList();

        dto.setAuthorityIds(authorityIds);
        dto.setSpecializationIds(specializationIds);
        dto.setPatientIds(patientIds);
        dto.setExaminationIds(examinationIds);

        return dto;
    }

}
