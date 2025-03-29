package com.nbu.medicalreport.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;


@EqualsAndHashCode(callSuper = true)
@Data
public class CreatePatientDTO extends CreateUserDTO{
    private String egn;
    private Long personalDoctorId;
    private boolean hasPaidInsurance;
}
