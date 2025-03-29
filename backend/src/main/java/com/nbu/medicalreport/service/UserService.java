package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.UpdateUserDTO;
import com.nbu.medicalreport.dto.UserDTO;
import com.nbu.medicalreport.dto.CreateUserDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<UserDTO> getUsers();
    UserDTO getUserById(long id);
    CreateUserDTO createUser(CreateUserDTO createUserDTO);
    UpdateUserDTO updateUser(long id, UpdateUserDTO updateUserDTO);
    void deleteUser(long id);

}
