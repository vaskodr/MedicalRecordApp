package com.nbu.medicalreport.data.enums;

import lombok.Getter;

@Getter
public enum VisitStatus {
    WAITING_FOR,
    COMPLETED,
    CANCELLED,
    RESCHEDULED
}
