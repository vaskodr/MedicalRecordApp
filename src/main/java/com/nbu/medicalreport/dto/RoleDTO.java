package com.nbu.medicalreport.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoleDTO {
    private long id;
    private String authority;
    private List<Long> userIds;
}
