package com.nbu.medicalreport.dto;

import jakarta.annotation.Nullable;
import lombok.Data;

import java.util.List;

@Data
public class UpdateUserDTO {
    @Nullable
    private String firstName;
    @Nullable
    private String lastName;
    @Nullable
    private String birthDate;
    @Nullable
    private String email;
    @Nullable
    private String username;
    @Nullable
    private String password;
    @Nullable
    private String phone;
    @Nullable
    private String address;
    @Nullable
    private String gender;
    @Nullable
    private List<Long> roleIds;
}
