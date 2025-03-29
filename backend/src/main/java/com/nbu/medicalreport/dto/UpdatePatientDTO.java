package com.nbu.medicalreport.dto;

import jakarta.annotation.Nullable;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class UpdatePatientDTO extends UpdateUserDTO{
    private String egn;
    private Long personalDoctorId;
    private boolean hasPaidInsurance;
}
