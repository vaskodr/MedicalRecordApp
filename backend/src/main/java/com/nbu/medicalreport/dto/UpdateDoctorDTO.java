package com.nbu.medicalreport.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class UpdateDoctorDTO extends UpdateUserDTO {
    private boolean isGP;
    private List<Long> specializationIds;
}
