package com.nbu.medicalreport.util.mapper;

import com.nbu.medicalreport.data.entity.models.Doctor;
import com.nbu.medicalreport.data.entity.models.Patient;
import com.nbu.medicalreport.data.entity.models.Role;
import com.nbu.medicalreport.data.entity.models.User;
import com.nbu.medicalreport.dto.DoctorDTO;
import com.nbu.medicalreport.dto.PatientDTO;
import com.nbu.medicalreport.dto.RoleDTO;
import com.nbu.medicalreport.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
@Component
@RequiredArgsConstructor
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    public <S, T> List<T> mapList(List<S> sourceList, Class<T> targetClass) {
        return sourceList
                .stream()
                .map(element -> modelMapper().map(element, targetClass))
                .collect(Collectors.toList());
    }

}
