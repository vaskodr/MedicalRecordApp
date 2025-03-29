package com.nbu.medicalreport.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateRoleDTO {
    private String authority;
    private List<Long> userIds;
}
