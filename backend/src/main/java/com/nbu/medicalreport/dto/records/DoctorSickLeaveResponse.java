package com.nbu.medicalreport.dto.records;

import com.nbu.medicalreport.dto.SickLeaveDTO;
import java.time.LocalDate;
import java.util.List;

public record DoctorSickLeaveResponse(
        Long doctorId,
        String doctorIdentity,
        String firstName,
        String lastName,
        String fullName,
        Long sickLeaveCount,
        boolean hasSickLeaves
) {
    public DoctorSickLeaveResponse(Long doctorId, String doctorIdentity, String firstName, String lastName, Long sickLeaveCount) {
        this(
                doctorId,
                doctorIdentity != null ? doctorIdentity : "N/A",
                firstName != null ? firstName : "N/A",
                lastName != null ? lastName : "N/A",
                createFullName(firstName, lastName),
                sickLeaveCount,
                true
        );
    }

    private static String createFullName(String firstName, String lastName) {
        String first = firstName != null ? firstName : "N/A";
        String last = lastName != null ? lastName : "N/A";
        return first + " " + last;
    }

    public static DoctorSickLeaveResponse noData() {
        return new DoctorSickLeaveResponse(null, null, null, null, "No data available", 0L, false);
    }
}
