package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.data.repository.DoctorRepository;
import com.nbu.medicalreport.dto.CreatePatientDTO;
import com.nbu.medicalreport.dto.PatientDTO;
import com.nbu.medicalreport.dto.UpdatePatientDTO;
import com.nbu.medicalreport.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientApiController {
    private final PatientService patientService;
    private final DoctorRepository doctorRepository;

    @GetMapping("/list")
    public List<PatientDTO> getPatients(){
        return this.patientService.getPatients();
    }

    @GetMapping("/by-egn/{egn}")
    public PatientDTO getPatientByEgn(@PathVariable String egn) {
        return this.patientService.getPatientByEgn(egn);
    }

    @GetMapping("/{id}")
    public PatientDTO getPatientById(@PathVariable int id){
        return this.patientService.getPatientById(id);
    }

    @PostMapping
    public PatientDTO createPatient(@RequestBody CreatePatientDTO createPatientDTO){
        return this.patientService.createPatient(createPatientDTO);
    }

    @PutMapping("/{id}")
    public PatientDTO updatePatient(@PathVariable int id, @RequestBody UpdatePatientDTO updatePatientDTO){
        return this.patientService.updatePatient(id,updatePatientDTO);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable int id){
        this.patientService.deletePatient(id);
    }

    @GetMapping("/by-doctor/{doctorId}")
    public ResponseEntity<List<PatientDTO>> getPatientsByDoctor(@PathVariable long doctorId) {
        // Assuming you have a method to find a doctor by their ID
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        List<PatientDTO> patients = patientService.getPatientsByDoctor(doctor);
        return ResponseEntity.ok(patients);
    }
}
