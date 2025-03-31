package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.*;
import com.nbu.medicalreport.data.repository.DiagnosisRepository;
import com.nbu.medicalreport.data.repository.DoctorRepository;
import com.nbu.medicalreport.data.repository.ExaminationRepository;
import com.nbu.medicalreport.data.repository.PatientRepository;
import com.nbu.medicalreport.dto.*;
import com.nbu.medicalreport.dto.records.DiagnosisFrequencyDTO;
import com.nbu.medicalreport.dto.records.DoctorVisitCountDTO;
import com.nbu.medicalreport.dto.records.PatientsWithDiagnosisDTO;
import com.nbu.medicalreport.service.ExaminationService;
import com.nbu.medicalreport.service.PatientService;
import com.nbu.medicalreport.service.SickLeaveService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationServiceImpl implements ExaminationService {

    private final ExaminationRepository examinationRepository;
    private final MapperConfig mapperConfig;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final SickLeaveService sickLeaveService;

    public List<ExaminationDTO> getExaminations() {
        List<Examination> examinations = examinationRepository.findAll();
        return examinations.stream()
                .map(this::convertToExaminationDTO)
                .collect(Collectors.toList());
    }

    public ExaminationDTO getExaminationById(long id) {
        Optional<Examination> examinationOpt = examinationRepository.findById(id);
        return examinationOpt.map(this::convertToExaminationDTO)
                .orElseThrow(() -> new EntityNotFoundException("Examination not found"));
    }

    @Override
    public ExaminationDTO createExamination(long doctorId, long patientId, CreateExaminationDTO createExaminationDTO) {
        Doctor doctor = this.doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Patient patient = this.patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Examination examination = new Examination();
        examination.setDoctor(doctor);
        examination.setPatient(patient);
        examination.setExaminationDate(createExaminationDTO.getExaminationDate());
        examination.setTreatment(createExaminationDTO.getTreatment());
        examination.setSickLeave(null);

        if (createExaminationDTO.getDiagnosisIds() != null && !createExaminationDTO.getDiagnosisIds().isEmpty()) {
            List<Diagnosis> diagnoses = new ArrayList<>(
                    createExaminationDTO.getDiagnosisIds().stream()
                            .map(id -> this.diagnosisRepository.findById(id)
                                    .orElseThrow(() -> new IllegalArgumentException("Diagnosis with ID " + id + " not found")))
                            .toList());
            examination.setDiagnoses(new HashSet<>(diagnoses));
        }

        this.examinationRepository.save(examination);

       return convertToExaminationDTO(examination);
    }

    @Override
    public ExaminationDTO updateExamination(long id, UpdateExaminationDTO updateExaminationDTO) {
        Examination examination = examinationRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Examination not found")
        );

        mapperConfig.modelMapper().getConfiguration().setSkipNullEnabled(true);
        mapperConfig.modelMapper().map(updateExaminationDTO, examination);

        examinationRepository.save(examination);
        return convertToExaminationDTO(examination);
    }

    @Override
    public void deleteExamination(long id) {
        this.examinationRepository.deleteById(id);
    }



    @Override
    public List<ExaminationDTO> getExaminationsByPatientId(long patientId) {
        List<Examination> examinations = examinationRepository.getExaminationsByPatientId(patientId);
        return examinations.stream()
                .map(this::convertToExaminationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExaminationDTO> getExaminationsByDoctorId(long doctorId) {
        return mapperConfig
                .mapList(this.examinationRepository.getExaminationsByDoctorId(doctorId), ExaminationDTO.class);
    }

    @Override
    public List<DoctorVisitCountDTO> getVisitCountPerDoctor() {
        return examinationRepository.findVisitCountPerDoctor();
    }

    @Override
    public List<PatientsWithDiagnosisDTO> getPatientsByDiagnosis(String diagnosisName) {
        return examinationRepository.findPatientsByDiagnosis(diagnosisName);
    }

    public List<DiagnosisFrequencyDTO> getMostFrequentDiagnoses() {
        return examinationRepository.findMostFrequentDiagnoses();
    }


    private ExaminationDTO convertToExaminationDTO(Examination examination) {
        ExaminationDTO dto = mapperConfig.modelMapper().map(examination, ExaminationDTO.class);

        // Convert diagnoses to diagnosis IDs manually
        List<Long> diagnosisIds = examination.getDiagnoses().stream()
                .map(Diagnosis::getId)
                .collect(Collectors.toList());

        dto.setDiagnosisIds(diagnosisIds);

        if (examination.getSickLeave() != null) {
            Long sickLeaveId = examination.getSickLeave().getId();

            dto.setSickLeaveId(sickLeaveId);
        } else {
            dto.setSickLeaveId(null);
        }


        return dto;
    }




//    @Override
//    @Transactional
//    public ExaminationDTO issueAnExamination(long doctorId, CreateExaminationRequestDTO requestDTO) {
//        // Step 1: Validate Doctor
//        Doctor doctor = doctorRepository.findById(doctorId)
//                .orElseThrow(() -> new RuntimeException("Doctor not found"));
//
//        // Step 2: Check if Patient exists by EGN
//        Patient patient = patientRepository.findByEgn(requestDTO.getPatient().getEgn());
//        if (patient == null) {
//            // Step 3: If the patient does not exist, register the patient using the existing createPatient method
//            System.out.println("Patient with EGN " + requestDTO.getPatient().getEgn() + " does not exist. Registering new patient...");
//
//            // Call the existing createPatient method
//            CreatePatientDTO createPatientDTO = requestDTO.getPatient(); // Map the patient data from the request
//            CreatePatientDTO registeredPatientDTO = patientService.createPatient(createPatientDTO);
//
//            // Retrieve the newly created patient entity
//            patient = patientRepository.findByEgn(registeredPatientDTO.getEgn());
//            if (patient == null) {
//                throw new IllegalStateException("Failed to register the patient with EGN: " + createPatientDTO.getEgn());
//            }
//        }
//
//        // Step 4: Create the Examination
//        Examination examination = new Examination();
//        examination.setExaminationDate(requestDTO.getExaminationDate());
//        examination.setTreatment(requestDTO.getTreatment());
//
//        // Handle diagnoses
//        if (requestDTO.getDiagnosisIds() != null && !requestDTO.getDiagnosisIds().isEmpty()) {
//            List<Diagnosis> diagnoses = requestDTO.getDiagnosisIds().stream()
//                    .map(id -> this.diagnosisRepository.findById(id)
//                            .orElseThrow(() -> new IllegalArgumentException("Diagnosis with ID " + id + " not found")))
//                    .collect(Collectors.toList());
//            examination.setDiagnoses(new HashSet<>(diagnoses));
//        }
//
//        // Step 5: Associate the doctor and the patient with the examination
//        examination.setDoctor(doctor);
//        examination.setPatient(patient);
//
//        // Step 6: Save the Examination
//        examinationRepository.save(examination);
//
//        // Step 7: Return the ExaminationDTO
//        return mapperConfig.modelMapper().map(examination, ExaminationDTO.class);
//    }




//    private Patient getOrCreatePatient(CreatePatientDTO patientDTO) {
//        // Check if the patient exists by EGN
//        if (patientDTO != null && checkEgnExists(patientDTO.getEgn())) {
//            System.out.println("Patient with EGN " + patientDTO.getEgn() + " exists.");
//            return patientRepository.findByEgn(patientDTO.getEgn());
//        } else {
//            // If patient does not exist, create the patient
//            Patient patient = mapperConfig.modelMapper().map(patientService.createPatient(patientDTO), Patient.class);
//            System.out.println("Patient created with EGN: " + patientDTO.getEgn());
//            return patient;
//        }
//    }
//
//    private boolean checkEgnExists(String egn) {
//        Patient patient = patientRepository.findByEgn(egn);
//        return patient != null;
//    }

}
