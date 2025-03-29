package com.nbu.medicalreport.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDiagnosisDTO {

    @NotBlank
    private String diagnosis;
    private String description;

}
