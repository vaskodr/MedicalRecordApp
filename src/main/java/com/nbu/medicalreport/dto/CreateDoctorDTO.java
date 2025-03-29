package com.nbu.medicalreport.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class CreateDoctorDTO extends CreateUserDTO{
    private boolean isGP;
    private List<Long> specializationIds;
}
