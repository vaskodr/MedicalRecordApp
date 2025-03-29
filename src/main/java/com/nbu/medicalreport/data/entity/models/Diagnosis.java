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
public class Diagnosis extends BaseEntity {
    
    private String diagnosis;
    private String description;

    @ManyToMany(mappedBy = "diagnoses")
    private Set<Examination> examinations;

}
