package com.nbu.medicalreport.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SickLeaveDTO {
    private long id;
    private String note;
    private LocalDate startDate;
    private LocalDate endDate;
    private int days;
    private long examinationId;
}
