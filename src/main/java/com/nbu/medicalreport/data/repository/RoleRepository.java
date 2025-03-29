package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByAuthority(String authority);
}
