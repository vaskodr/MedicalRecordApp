package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.SickLeave;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SickLeaveRepository extends JpaRepository<SickLeave, Long> {

}