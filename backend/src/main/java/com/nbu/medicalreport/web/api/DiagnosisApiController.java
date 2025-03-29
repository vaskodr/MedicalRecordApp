package com.nbu.medicalreport.web.api;


import com.nbu.medicalreport.dto.CreateDiagnosisDTO;
import com.nbu.medicalreport.dto.DiagnosisDTO;
import com.nbu.medicalreport.dto.UpdateDiagnosisDTO;
import com.nbu.medicalreport.service.DiagnosisService;
import jdk.jshell.Diag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/diagnosis")
@RequiredArgsConstructor
public class DiagnosisApiController {

    private final DiagnosisService diagnosisService;

    @GetMapping("/list")
    public List<DiagnosisDTO> getDiagnoses() {
        return this.diagnosisService.getDiagnoses();
    }

    @GetMapping("/{id}")
    public DiagnosisDTO getDiagnosis(@PathVariable long id) {
        return this.diagnosisService.getDiagnosisById(id);
    }

    @PostMapping
    public DiagnosisDTO createDiagnosis(@RequestBody CreateDiagnosisDTO createDiagnosisDTO) {
         return this.diagnosisService.createDiagnosis(createDiagnosisDTO);
    }

    @PutMapping("/{id}")
    public DiagnosisDTO updateDiagnosis(@PathVariable long id, @RequestBody UpdateDiagnosisDTO updateDiagnosisDTO) {
        return this.diagnosisService.updateDiagnosis(id, updateDiagnosisDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteDiagnosis(@PathVariable long id) {
        this.diagnosisService.deleteDiagnosis(id);
    }


    @GetMapping("/statistics")
    public ResponseEntity<List<Map<String, Object>>> getStatistics() {
        return ResponseEntity.ok(diagnosisService.getDiagnosisStatistics());
    }


}
