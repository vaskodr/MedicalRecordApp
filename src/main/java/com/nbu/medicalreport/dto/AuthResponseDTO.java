package com.nbu.medicalreport.dto;

import lombok.Data;

import java.util.List;

@Data
public class AuthResponseDTO {
    private String accessToken;
    private List<String> authorities;
    private UserDTO userDTO;
}
