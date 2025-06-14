package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.CreateDoctorDTO;
import com.nbu.medicalreport.dto.DoctorDTO;
import com.nbu.medicalreport.dto.UpdateDoctorDTO;
import com.nbu.medicalreport.dto.records.DoctorSickLeaveResponse;
import com.nbu.medicalreport.dto.records.GPPatientCountDTO;
import com.nbu.medicalreport.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/doctor")
public class DoctorApiController {

    private final DoctorService doctorService;

    @GetMapping("/list")
    public List<DoctorDTO> getDoctors() {
        return this.doctorService.getDoctors();
    }

    @GetMapping("/gp-list")
    public List<DoctorDTO> getAllGPDoctors() {
        return this.doctorService.getGPDoctors();
    }

    @GetMapping("/{id}")
    public DoctorDTO getDoctorById(@PathVariable int id) {
        return this.doctorService.getDoctorById(id);
    }

    @PostMapping
    public DoctorDTO createDoctor(@RequestBody CreateDoctorDTO createDoctorDTO) {
        return this.doctorService.createDoctor(createDoctorDTO);
    }

    @PutMapping("/{id}")
    public DoctorDTO updateDoctor(@PathVariable long id, @RequestBody UpdateDoctorDTO updateDoctorDTO) {
        return this.doctorService.updateDoctor(id, updateDoctorDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable int id) {
        this.doctorService.deleteDoctor(id);
    }

    // QUERIES

    @GetMapping("/gp-patient-count")
    public ResponseEntity <List<GPPatientCountDTO>> findPatientCountByGPs() {
        return ResponseEntity.ok(doctorService.getPatientCountByGPs());
    }

    @GetMapping("/statistics/doctors-most-sick-leaves")
    public ResponseEntity<List<DoctorSickLeaveResponse>> getDoctorsWithMostSickLeaves() {
        List<DoctorSickLeaveResponse> doctors = doctorService.getDoctorsWithMostSickLeaves();
        return ResponseEntity.ok(doctors);
    }


}
