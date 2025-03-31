package com.nbu.medicalreport.data.entity.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Doctor extends User{

    @Column(unique = true, nullable = false)
    private String doctorIdentity;

    private boolean isGP;

    @OneToMany(mappedBy = "personalDoctor")
    private Set<Patient> registeredPatients = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "doctors_have_specializations",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "specialization_id")
    )
    private Set<Specialization> specializations = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    private Set<Examination> examinations = new HashSet<>();

}
