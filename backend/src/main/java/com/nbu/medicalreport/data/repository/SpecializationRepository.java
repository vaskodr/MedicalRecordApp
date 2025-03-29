package com.nbu.medicalreport.data.repository;

import com.nbu.medicalreport.data.entity.models.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
    Specialization findByName(String name);
    @Query("SELECT s FROM Specialization s WHERE s.name <> :name")
    List<Specialization> findAllWithoutName(@Param("name") String name);

}
