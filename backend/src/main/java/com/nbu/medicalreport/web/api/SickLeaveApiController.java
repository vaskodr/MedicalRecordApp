package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.CreateSickLeaveDTO;
import com.nbu.medicalreport.dto.SickLeaveDTO;
import com.nbu.medicalreport.dto.UpdateSickLeaveDTO;
import com.nbu.medicalreport.service.SickLeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sick-leave")
@RequiredArgsConstructor
public class SickLeaveApiController {
    private final SickLeaveService sickLeaveService;

    @GetMapping("/list")
    public List<SickLeaveDTO> getSickLeaves() {
        return this.sickLeaveService.getSickLeaves();
    }

    @GetMapping("/{id}")
    public SickLeaveDTO getSickLeaveById(@PathVariable long id) {
        return this.sickLeaveService.getSickLeaveById(id);
    }

    @PostMapping("/examination/{examinationId}")
    public SickLeaveDTO createSickLeave(@PathVariable long examinationId, @RequestBody CreateSickLeaveDTO createSickLeaveDTO) {
        return this.sickLeaveService.createSickLeave(examinationId, createSickLeaveDTO);
    }

    @PutMapping("/{id}")
    public SickLeaveDTO updateSickLeave(@PathVariable long id, UpdateSickLeaveDTO updateSickLeaveDTO) {
        return this.sickLeaveService.updateSickLeave(id, updateSickLeaveDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteSickLeave(@PathVariable long id) {
        this.sickLeaveService.deleteSickLeave(id);
    }

    @GetMapping("/statistics/peak-month")
    public ResponseEntity<Map<String, Object>> getMonthWithMostSickLeaves(
            @RequestParam(required = false) Integer year) {
        Map<String, Object> peakMonth = sickLeaveService.getMonthWithMostSickLeavesInYear(year);
        return ResponseEntity.ok(peakMonth);
    }
}
