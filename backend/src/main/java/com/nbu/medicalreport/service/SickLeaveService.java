package com.nbu.medicalreport.service;

import com.nbu.medicalreport.dto.CreateSickLeaveDTO;
import com.nbu.medicalreport.dto.SickLeaveDTO;
import com.nbu.medicalreport.dto.UpdateSickLeaveDTO;

import java.util.List;

public interface SickLeaveService {
    List<SickLeaveDTO> getSickLeaves();
    SickLeaveDTO getSickLeaveById(long id);
    SickLeaveDTO createSickLeave(long examinationId, CreateSickLeaveDTO createSickLeaveDTO);
    SickLeaveDTO updateSickLeave(long id, UpdateSickLeaveDTO updateSickLeaveDTO);
    void deleteSickLeave(long id);
}
