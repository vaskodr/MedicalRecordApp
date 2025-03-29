package com.nbu.medicalreport.data.entity.models;

import com.nbu.medicalreport.data.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
public class Specialization extends BaseEntity {

    private String name;

    @ManyToMany(mappedBy = "specializations")
    private Set<Doctor> doctors;

}
