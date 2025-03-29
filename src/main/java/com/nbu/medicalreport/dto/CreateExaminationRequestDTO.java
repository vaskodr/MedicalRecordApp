package com.nbu.medicalreport.dto;

import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateExaminationRequestDTO {
    private LocalDate examinationDate;
    private String treatment;
    private List<Long> diagnosisIds;

    @Nullable
    private CreatePatientDTO patient;

}
