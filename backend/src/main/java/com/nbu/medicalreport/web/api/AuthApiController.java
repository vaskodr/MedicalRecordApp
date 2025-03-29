package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.AuthResponseDTO;
import com.nbu.medicalreport.dto.CreateUserDTO;
import com.nbu.medicalreport.dto.LoginRequestDTO;
import com.nbu.medicalreport.dto.RegistrationRequestDTO;
import com.nbu.medicalreport.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthApiController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        AuthResponseDTO authResponseDTO = authService.login(loginRequestDTO);
        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationRequestDTO registrationRequestDTO) {
        String res = authService.registerUser(registrationRequestDTO);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        authService.logout();
        return new ResponseEntity<>("Logout successful", HttpStatus.OK);
    }
}
