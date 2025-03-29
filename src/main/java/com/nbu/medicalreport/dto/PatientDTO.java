package com.nbu.medicalreport.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class PatientDTO extends UserDTO{
    private String egn;
    private Long personalDoctorId;
    private boolean hasPaidInsurance;
    private List<Long> examinationIds;
}
