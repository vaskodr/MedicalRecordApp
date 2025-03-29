package com.nbu.medicalreport.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateExaminationDTO {
    private LocalDate examinationDate;
    private String treatment;
    private List<Long> diagnosisIds;
}
