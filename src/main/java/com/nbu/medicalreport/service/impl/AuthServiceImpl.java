package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.dto.*;
import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.data.entity.models.Patient;
import com.nbu.medicalreport.data.entity.models.Role;
import com.nbu.medicalreport.data.entity.models.User;
import com.nbu.medicalreport.data.repository.DoctorRepository;
import com.nbu.medicalreport.data.repository.PatientRepository;
import com.nbu.medicalreport.data.repository.UserRepository;
import com.nbu.medicalreport.security.JwtTokenProvider;
import com.nbu.medicalreport.service.AuthService;
import com.nbu.medicalreport.service.DoctorService;
import com.nbu.medicalreport.service.PatientService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientService patientService;
    private final DoctorService doctorService;
    private final JwtTokenProvider jwtTokenProvider;
    private final MapperConfig mapperConfig;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUsernameOrEmail(),
                        loginRequestDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        Optional<User> user = userRepository.findByUsername(loginRequestDTO.getUsernameOrEmail());
        List<String> authorities = new ArrayList<>();
        UserDTO userDTO = new UserDTO();

        if (user.isPresent()) {
            User loggedInUser = user.get();
            authorities = loggedInUser.getAuthorities().stream()
                    .map(Role::getAuthority)
                    .toList();

            userDTO = mapperConfig.modelMapper().map(loggedInUser, UserDTO.class);

            if (authorities.contains("ROLE_PATIENT")) {
                Patient patient = patientRepository.findById(loggedInUser.getId())
                        .orElseThrow(
                                () -> new IllegalArgumentException("Patient not found")
                        );
            } else if (authorities.contains("ROLE_DOCTOR")) {
                Doctor doctor = doctorRepository.findById(loggedInUser.getId())
                        .orElseThrow(
                                () -> new IllegalArgumentException("Doctor not found")
                        );
            }
        }

        AuthResponseDTO authResponseDTO = new AuthResponseDTO();
        authResponseDTO.setAuthorities(authorities);
        authResponseDTO.setAccessToken(token);
        authResponseDTO.setUserDTO(userDTO);

        return authResponseDTO;
    }

    @Transactional
    public String registerUser(RegistrationRequestDTO registrationRequestDTO) {
        if (registrationRequestDTO.getUserType().equals("patient")) {
            CreatePatientDTO patientDTO = new CreatePatientDTO();
            // Using ModelMapper to map the fields
            mapperConfig.modelMapper().map(registrationRequestDTO, patientDTO);
            patientService.createPatient(patientDTO);
            return "Patient registered successfully";
        } else if ("doctor".equals(registrationRequestDTO.getUserType())) {
            // Handle doctor registration
            CreateDoctorDTO doctorDTO = new CreateDoctorDTO();
            mapperConfig.modelMapper().map(registrationRequestDTO, doctorDTO);
            doctorService.createDoctor(doctorDTO);
            return "Doctor registered successfully";
        }
        return "Invalid user type provided";
    }



    @Override
    public void logout() {
        SecurityContextHolder.clearContext();
    }


}
