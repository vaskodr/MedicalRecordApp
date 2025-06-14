package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.*;
import com.nbu.medicalreport.dto.records.DiagnosisFrequencyDTO;
import com.nbu.medicalreport.dto.records.DoctorVisitCountDTO;
import com.nbu.medicalreport.dto.records.PatientsWithDiagnosisDTO;
import com.nbu.medicalreport.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/examination")
@RequiredArgsConstructor
public class ExaminationApiController {

    private final ExaminationService examinationService;

    /* CRUD */

    @GetMapping("/list")
    public List<ExaminationDTO> getExaminations() {
        return this.examinationService.getExaminations();
    }

    @GetMapping("/{id}")
    public ExaminationDTO getExaminationById(@PathVariable long id) {
        return this.examinationService.getExaminationById(id);
    }

    @PostMapping("/doctor/{doctorId}/patient/{patientId}")
    public ExaminationDTO createExamination(@PathVariable long doctorId, @PathVariable long patientId, @RequestBody CreateExaminationDTO createExaminationDTO) {
        return this.examinationService.createExamination(doctorId, patientId, createExaminationDTO);
    }

    @PutMapping("/{id}")
    public ExaminationDTO updateExamination(@PathVariable long id, @RequestBody UpdateExaminationDTO updateExaminationDTO) {
        return this.examinationService.updateExamination(id, updateExaminationDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteExamination(@PathVariable long id) {
        this.examinationService.deleteExamination(id);
    }

    /* ADDITION SERVICES */

    @GetMapping("/patient/{patientId}")
    public List<ExaminationDTO> getExaminationsByPatientId(@PathVariable long patientId) {
        return this.examinationService.getExaminationsByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<ExaminationDTO> getExaminationsByDoctorId(@PathVariable long doctorId) {
        return this.examinationService.getExaminationsByDoctorId(doctorId);
    }

    @GetMapping("/visits-per-doctor")
    public ResponseEntity<List<DoctorVisitCountDTO>> getVisitCountPerDoctor() {
        List<DoctorVisitCountDTO> visitCounts = examinationService.getVisitCountPerDoctor();
        return ResponseEntity.ok(visitCounts);
    }

    @GetMapping("/patients-by-diagnosis")
    public ResponseEntity<List<PatientsWithDiagnosisDTO>> getPatientsByDiagnosis(
            @RequestParam("diagnosisName") String diagnosisName) {
        List<PatientsWithDiagnosisDTO> patients = examinationService.getPatientsByDiagnosis(diagnosisName);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/most-frequent-diagnoses")
    public ResponseEntity<List<DiagnosisFrequencyDTO>> getMostFrequentDiagnoses() {
        List<DiagnosisFrequencyDTO> diagnoses = examinationService.getMostFrequentDiagnoses();
        return ResponseEntity.ok(diagnoses);
    }

    @GetMapping("/by-period")
    public ResponseEntity<List<ExaminationDTO>> getExaminationsByPeriod(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ExaminationDTO> examinations = examinationService.getExaminationsByDateRange(startDate, endDate);
        return ResponseEntity.ok(examinations);
    }

    @GetMapping("/doctor/{doctorId}/by-period")
    public ResponseEntity<List<ExaminationDTO>> getExaminationsByDoctorAndPeriod(
            @PathVariable Long doctorId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ExaminationDTO> examinations = examinationService.getExaminationsByDoctorAndDateRange(doctorId, startDate, endDate);
        return ResponseEntity.ok(examinations);
    }

//    @PostMapping("/doctor/{doctorId}")
//    public ResponseEntity<ExaminationDTO> createExaminationByDoctor(@PathVariable long doctorId,
//                                                                    @RequestBody CreateExaminationRequestDTO requestDTO) {
//        ExaminationDTO createdExamination = examinationService.issueAnExamination(doctorId, requestDTO);
//
//        // Return the created examination as response
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdExamination);
//    }



}
