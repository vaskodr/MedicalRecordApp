package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.*;
import com.nbu.medicalreport.data.enums.Gender;
import com.nbu.medicalreport.data.repository.DoctorRepository;
import com.nbu.medicalreport.data.repository.PatientRepository;
import com.nbu.medicalreport.data.repository.RoleRepository;
import com.nbu.medicalreport.dto.CreatePatientDTO;
import com.nbu.medicalreport.dto.PatientDTO;
import com.nbu.medicalreport.dto.UpdatePatientDTO;
import com.nbu.medicalreport.dto.UserDTO;
import com.nbu.medicalreport.service.PatientService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final MapperConfig mapperConfig;
    private final RoleRepository roleRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<PatientDTO> getPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(this::convertToPatientDTO)
                .toList();
    }

    @Override
    public PatientDTO getPatientById(long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.map(this::convertToPatientDTO).orElseThrow(
                () -> new IllegalArgumentException("Patient not found")
        );
    }

    @Override
    @Transactional
    public PatientDTO createPatient(CreatePatientDTO createPatientDTO) {
        Patient patient = new Patient();
        Role rolePatient = roleRepository.findByAuthority("ROLE_PATIENT");
        if (rolePatient == null) {
            throw new IllegalArgumentException("Role 'ROLE_PATIENT' not found");
        }
        Doctor personalDoctor = doctorRepository.findById(createPatientDTO.getPersonalDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID " + createPatientDTO.getPersonalDoctorId()));
        try {
            validateEgn(createPatientDTO.getEgn());
        } catch (ConstraintViolationException e) {
            System.out.println(e.getMessage());
            throw new IllegalArgumentException("Invalid EGN provided");
        }

        mapperConfig.modelMapper().map(createPatientDTO, patient);
        patient.setPassword(passwordEncoder.encode(createPatientDTO.getPassword()));
        Set<Role> roles = new HashSet<>();
        roles.add(rolePatient);
        patient.setAuthorities(roles);
        patient.setPersonalDoctor(personalDoctor);
        patientRepository.save(patient);
        return convertToPatientDTO(patient);
    }


    @Override
    public PatientDTO updatePatient(long id, UpdatePatientDTO updatePatientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Patient not found")
                );

        mapperConfig.modelMapper().getConfiguration().setSkipNullEnabled(true);
        mapperConfig.modelMapper().map(updatePatientDTO, patient);

        patientRepository.save(patient);

        return convertToPatientDTO(patient);
    }

    @Override
    public void deletePatient(long id) {
         this.patientRepository.deleteById(id);
    }



    @Override
    public PatientDTO getPatientByEgn(String egn) {
        return mapperConfig.modelMapper().map(this.patientRepository.findByEgn(egn), PatientDTO.class);
    }

    @Override
    public List<com.nbu.medicalreport.dto.records.PatientDTO> getPatientsByDoctor(long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        return this.patientRepository.findPatientsByPersonalDoctor(doctor);
    }


    private void validateEgn(String egn) {
        if (egn == null || !Pattern.matches("\\d{10}", egn)) {
            throw new ConstraintViolationException("EGN must be exactly 10 digits", null);
        }
    }

    private PatientDTO convertToPatientDTO(Patient patient) {
        PatientDTO dto = mapperConfig.modelMapper().map(patient, PatientDTO.class);

        List<Long> authorityIds = patient.getAuthorities().stream()
                .map(Role::getId)
                .toList();

        List<Long> examinationIds = patient.getExaminations().stream()
                .map(Examination::getId)
                .toList();

        dto.setAuthorityIds(authorityIds);
        dto.setExaminationIds(examinationIds);

        return dto;
    }
}
