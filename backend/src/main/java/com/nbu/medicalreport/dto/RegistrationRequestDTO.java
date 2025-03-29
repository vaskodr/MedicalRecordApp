package com.nbu.medicalreport.dto;

import jakarta.annotation.Nullable;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class RegistrationRequestDTO extends CreateUserDTO{

    private boolean isGP;
    @Nullable
    private List<Long> specializationIds;
    @Nullable
    private String egn;
    @Nullable
    private long personalDoctorId;
    private boolean hasPaidInsurance;
}
