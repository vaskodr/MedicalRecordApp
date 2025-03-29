package com.nbu.medicalreport.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateSickLeaveDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private int days;
    private String note;
}
