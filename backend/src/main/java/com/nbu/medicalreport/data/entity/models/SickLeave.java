package com.nbu.medicalreport.data.entity.models;

import com.nbu.medicalreport.data.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Getter
@Setter
public class SickLeave extends BaseEntity {

    private LocalDate startDate;
    private LocalDate endDate;
    private int days = getDays();
    private String note;

    @OneToOne
    @JoinColumn(name = "examination_id", nullable = false)
    private Examination examination;

    @Transient
    public int getDays() {
        if (startDate != null && endDate != null) {
            return Period.between(startDate, endDate).getDays();
        }
        return 0;
    }

}