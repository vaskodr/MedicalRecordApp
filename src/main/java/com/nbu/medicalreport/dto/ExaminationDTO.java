package com.nbu.medicalreport.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ExaminationDTO {

    private long id;
    private LocalDate examinationDate;
    private String treatment;

    private Long doctorId;
    private Long patientId;
    private List<Long> diagnosisIds;
}
