package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.CreateOrUpdateSpecializationDTO;
import com.nbu.medicalreport.dto.SpecializationDTO;
import com.nbu.medicalreport.service.SpecializationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/specialization")
public class SpecializationApiController {
    private final SpecializationService specializationService;

    @GetMapping("/list")
    public List<SpecializationDTO> getAllSpecializations() {
        return this.specializationService.getSpecializations();
    }

    @GetMapping("/{id}")
    public SpecializationDTO getSpecializationById(@PathVariable Long id) {
        return this.specializationService.getSpecializationById(id);
    }

    @PostMapping
    public SpecializationDTO createSpecialization(@RequestBody CreateOrUpdateSpecializationDTO createSpecializationDTO) {
        return this.specializationService.createSpecialization(createSpecializationDTO);
    }

    @PutMapping("/{id}")
    public SpecializationDTO updateSpecialization(@PathVariable Long id, @RequestBody CreateOrUpdateSpecializationDTO updateSpecializationDTO) {
        return this.specializationService.updateSpecialization(id, updateSpecializationDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteSpecialization(@PathVariable Long id) {
        this.specializationService.deleteSpecialization(id);
    }
}
