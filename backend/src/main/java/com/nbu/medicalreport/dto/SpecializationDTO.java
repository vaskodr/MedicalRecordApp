package com.nbu.medicalreport.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpecializationDTO {

    private long id;
    private String name;

    private List<Long> doctorIds;
}
