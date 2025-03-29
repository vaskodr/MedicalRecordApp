package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.AuthResponseDTO;
import com.nbu.medicalreport.dto.LoginRequestDTO;
import com.nbu.medicalreport.dto.CreateUserDTO;
import com.nbu.medicalreport.dto.RegistrationRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO loginRequestDTO);
    String registerUser(RegistrationRequestDTO registrationRequestDTO);
    void logout();
}
