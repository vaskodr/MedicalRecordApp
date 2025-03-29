package com.nbu.medicalreport.dto;

import lombok.Data;

import java.util.List;

@Data
public class DiagnosisDTO {
    private Long id;
    private String diagnosis;
    private String description;

    private List<Long> examinationIds;
}
