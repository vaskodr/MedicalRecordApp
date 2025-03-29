package com.nbu.medicalreport.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String gender;
    private List<Long> authorityIds;
}
