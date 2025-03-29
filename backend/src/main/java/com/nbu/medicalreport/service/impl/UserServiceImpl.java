package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.Role;
import com.nbu.medicalreport.data.entity.models.User;
import com.nbu.medicalreport.data.enums.Gender;
import com.nbu.medicalreport.data.repository.RoleRepository;
import com.nbu.medicalreport.data.repository.UserRepository;
import com.nbu.medicalreport.dto.UpdateUserDTO;
import com.nbu.medicalreport.dto.UserDTO;
import com.nbu.medicalreport.service.UserService;
import com.nbu.medicalreport.dto.CreateUserDTO;
import com.nbu.medicalreport.util.mapper.MapperConfig;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MapperConfig mapperConfig;

    @Override
    public List<UserDTO> getUsers() {
        List<User> users = this.userRepository.findAll();
        return users.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(long id) {
        Optional<User> user = this.userRepository.findById(id);
        return user.map(this::convertToUserDTO).orElseThrow(
                () -> new IllegalArgumentException("User not found")
        );
    }

    @Override
    public CreateUserDTO createUser(CreateUserDTO createUserDTO) {
        User user = new User();

        user.setFirstName(createUserDTO.getFirstName());
        user.setLastName(createUserDTO.getLastName());
        user.setBirthDate(createUserDTO.getBirthDate());
        user.setEmail(createUserDTO.getEmail());
        user.setUsername(createUserDTO.getUsername());
        user.setPassword(createUserDTO.getPassword());
        user.setGender(Gender.valueOf(createUserDTO.getGender()));
        user.setAddress(createUserDTO.getAddress());
        user.setPhone(createUserDTO.getPhone());

        return mapperConfig.modelMapper().map(user, CreateUserDTO.class);
    }


    @Override
    public UpdateUserDTO updateUser(long id, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found."));

        // Update user fields if they are provided in the DTO
        if (updateUserDTO.getFirstName() != null) {
            user.setFirstName(updateUserDTO.getFirstName());
        }
        if (updateUserDTO.getLastName() != null) {
            user.setLastName(updateUserDTO.getLastName());
        }
        if (updateUserDTO.getBirthDate() != null) {
            user.setBirthDate(LocalDate.parse(updateUserDTO.getBirthDate())); // Assuming format is correct
        }
        if (updateUserDTO.getEmail() != null) {
            user.setEmail(updateUserDTO.getEmail());
        }
        if (updateUserDTO.getUsername() != null) {
            user.setUsername(updateUserDTO.getUsername());
        }
        if (updateUserDTO.getPassword() != null) {
            user.setPassword(updateUserDTO.getPassword()); // Ensure hashing if applicable
        }
        if (updateUserDTO.getPhone() != null) {
            user.setPhone(updateUserDTO.getPhone());
        }
        if (updateUserDTO.getAddress() != null) {
            user.setAddress(updateUserDTO.getAddress());
        }
        if (updateUserDTO.getGender() != null) {
            user.setGender(Gender.valueOf(updateUserDTO.getGender().toUpperCase()));
        }

        if (updateUserDTO.getRoleIds() != null) {
            List<Role> roles = updateUserDTO.getRoleIds().stream()
                    .map(roleId -> roleRepository.findById(roleId)
                            .orElseThrow(() -> new IllegalArgumentException("Role with ID " + roleId + " not found.")))
                    .toList();
            user.setAuthorities(new HashSet<>(roles));
        }

        user = userRepository.save(user);

        UpdateUserDTO responseDTO = mapperConfig.modelMapper().map(user, UpdateUserDTO.class);
        responseDTO.setRoleIds(user.getAuthorities().stream().map(Role::getId).toList());

        return responseDTO;
    }

    @Override
    public void deleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = this.userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(
                        () -> new UsernameNotFoundException("User not found with username or email " + usernameOrEmail)
                );

        Set<GrantedAuthority> authorities = user.getAuthorities().stream()
                .map(authorith -> new SimpleGrantedAuthority(authorith.getAuthority()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }


    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = mapperConfig.modelMapper().map(user, UserDTO.class);

        List<Long> authorityIds = user.getAuthorities().stream()
                .map(Role::getId)
                .toList();

        dto.setAuthorityIds(authorityIds);

        return dto;
    }
}
