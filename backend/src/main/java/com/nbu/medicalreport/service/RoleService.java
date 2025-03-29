package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.CreateRoleDTO;
import com.nbu.medicalreport.dto.RoleDTO;
import com.nbu.medicalreport.dto.UpdateRoleDTO;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getRoles();
    RoleDTO getRoleById(long id);
    RoleDTO createRole(CreateRoleDTO createRoleDTO);
    RoleDTO updateRole(long id, UpdateRoleDTO updateRoleDTO);
    void deleteRole(long id);
}
