package com.nbu.medicalreport.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class DoctorDTO extends UserDTO {
    private String doctorIdentity;
    private boolean isGP;
    private List<Long> specializationIds;
    private List<Long> patientIds;
    private List<Long> examinationIds;
}
