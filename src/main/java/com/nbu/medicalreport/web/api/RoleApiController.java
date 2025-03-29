package com.nbu.medicalreport.web.api;

import com.nbu.medicalreport.dto.CreateRoleDTO;
import com.nbu.medicalreport.dto.RoleDTO;
import com.nbu.medicalreport.dto.UpdateRoleDTO;
import com.nbu.medicalreport.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/role")
@RequiredArgsConstructor
public class RoleApiController {

    private final RoleService roleService;

    @GetMapping("/list")
    public List<RoleDTO> getRoles() {
        return this.roleService.getRoles();
    }

    @GetMapping("/{id}")
    public RoleDTO getRole(@PathVariable long id) {
        return this.roleService.getRoleById(id);
    }

    @PostMapping
    public RoleDTO createRole(@RequestBody CreateRoleDTO createRoleDTO) {
        return this.roleService.createRole(createRoleDTO);
    }

    @PutMapping("/{id}")
    public RoleDTO updateRole(@PathVariable long id, @RequestBody UpdateRoleDTO updateRoleDTO) {
        return this.roleService.updateRole(id, updateRoleDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable long id) {
        this.roleService.deleteRole(id);
    }
}
