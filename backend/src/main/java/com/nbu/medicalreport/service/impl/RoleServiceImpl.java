package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.Role;
import com.nbu.medicalreport.data.entity.models.User;
import com.nbu.medicalreport.data.repository.RoleRepository;
import com.nbu.medicalreport.dto.CreateRoleDTO;
import com.nbu.medicalreport.dto.UpdateRoleDTO;
import com.nbu.medicalreport.service.RoleService;
import com.nbu.medicalreport.dto.RoleDTO;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final MapperConfig mapperConfig;

    @Override
    public List<RoleDTO> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(this::convertToRoleDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(long id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.map(this::convertToRoleDTO)
                .orElseThrow(
                        () -> new IllegalArgumentException("Role not found")
                );

    }

    @Override
    public RoleDTO createRole(CreateRoleDTO createRoleDTO) {
        Role role = new Role();
        role.setAuthority("ROLE_" + createRoleDTO.getAuthority().toUpperCase());
        this.roleRepository.save(role);
        RoleDTO createdRoleDTO = new RoleDTO();
        createdRoleDTO.setAuthority(createdRoleDTO.getAuthority());
        return convertToRoleDTO(role);
    }

    @Override
    public RoleDTO updateRole(long id, UpdateRoleDTO updateRoleDTO) {
        Role role = roleRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Role not found")
        );
        mapperConfig.modelMapper().getConfiguration().setSkipNullEnabled(true);
        mapperConfig.modelMapper().map(updateRoleDTO, role);

        roleRepository.save(role);
        return convertToRoleDTO(role);
    }

    @Override
    public void deleteRole(long id) {
        this.roleRepository.deleteById(id);
    }

    @Override
    public List<RoleDTO> getRolesByUserId(long id) {
        return roleRepository.findByUsers_Id(id).stream()
                .map(this::convertToRoleDTO)
                .collect(Collectors.toList());
    }

    private RoleDTO convertToRoleDTO(Role role) {
        RoleDTO dto = mapperConfig.modelMapper().map(role, RoleDTO.class);
        List<Long> userIds = role.getUsers().stream()
                .map(User::getId)
                .toList();
        dto.setUserIds(userIds);
        return dto;
    }
}
