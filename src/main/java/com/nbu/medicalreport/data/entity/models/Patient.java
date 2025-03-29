package com.nbu.medicalreport.data.entity.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
public class Patient extends User {

    @Column(nullable = false, unique=true)
    @Size(min = 10, max = 10, message = "EGN must be exactly 10 digits")
    @Pattern(regexp = "\\d{10}", message = "EGN must contain only digits")
    private String egn;

    @Column(name = "has_paid_insurance", nullable = false)
    private boolean hasPaidInsurance;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Doctor personalDoctor;

    @OneToMany(mappedBy = "patient")
    private Set<Examination> examinations;

}
