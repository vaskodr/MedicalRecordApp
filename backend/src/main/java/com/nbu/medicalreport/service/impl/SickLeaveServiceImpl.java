package com.nbu.medicalreport.service.impl;

import com.nbu.medicalreport.data.entity.models.*;
import com.nbu.medicalreport.data.repository.ExaminationRepository;
import com.nbu.medicalreport.data.repository.SickLeaveRepository;
import com.nbu.medicalreport.dto.CreateSickLeaveDTO;
import com.nbu.medicalreport.dto.SickLeaveDTO;
import com.nbu.medicalreport.dto.UpdateSickLeaveDTO;
import com.nbu.medicalreport.service.SickLeaveService;
import com.nbu.medicalreport.util.mapper.MapperConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SickLeaveServiceImpl implements SickLeaveService {

    private final MapperConfig mapperConfig;
    private final ExaminationRepository examinationRepository;
    private final SickLeaveRepository sickLeaveRepository;

    @Override
    public List<SickLeaveDTO> getSickLeaves() {
        List<SickLeave> sickLeaves = sickLeaveRepository.findAll();
        return sickLeaves.stream()
                .map(this::convertToSickLeaveDTO)
                .toList();
    }

    @Override
    public SickLeaveDTO getSickLeaveById(long id) {
        Optional<SickLeave> sickLeave = this.sickLeaveRepository.findById(id);
        return sickLeave.map(this::convertToSickLeaveDTO).orElseThrow(
                () -> new IllegalArgumentException("Sick Leave Not Found")
        );
    }

    @Override
    public SickLeaveDTO createSickLeave(long examinationId, CreateSickLeaveDTO createSickLeaveDTO) {

        Examination examination = examinationRepository.findById(examinationId).orElseThrow(
                () -> new IllegalArgumentException("Examination Not Found")
        );

        SickLeave sickLeave = new SickLeave();
        sickLeave.setStartDate(createSickLeaveDTO.getStartDate());
        sickLeave.setEndDate(createSickLeaveDTO.getEndDate());
        sickLeave.setNote(createSickLeaveDTO.getNote());
        sickLeave.setExamination(examination);


        sickLeaveRepository.save(sickLeave);

        examination.setSickLeave(sickLeave);

        examinationRepository.save(examination);

        return convertToSickLeaveDTO(sickLeave);

    }

    @Override
    public SickLeaveDTO updateSickLeave(long id, UpdateSickLeaveDTO updateSickLeaveDTO) {
        SickLeave sickLeave = sickLeaveRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Sick leave Not Found")
        );

        if (updateSickLeaveDTO.getStartDate() != null) {
            sickLeave.setStartDate(updateSickLeaveDTO.getStartDate());
        }
        if (updateSickLeaveDTO.getEndDate() != null) {
            sickLeave.setEndDate(updateSickLeaveDTO.getEndDate());
        }
        if (updateSickLeaveDTO.getNote() != null) {
            sickLeave.setNote(updateSickLeaveDTO.getNote());
        }

        sickLeaveRepository.save(sickLeave);

        return convertToSickLeaveDTO(sickLeave);
    }

    @Override
    public void deleteSickLeave(long id) {
        this.sickLeaveRepository.deleteById(id);
    }

    private SickLeaveDTO convertToSickLeaveDTO(SickLeave sickLeave) {
        SickLeaveDTO dto = mapperConfig.modelMapper().map(sickLeave, SickLeaveDTO.class);

        long examinationId = sickLeave.getExamination().getId();
        dto.setExaminationId(examinationId);

        return dto;
    }

    @Override
    public Map<String, Object> getMonthWithMostSickLeavesInYear(int year) {
        Map<String, Object> queryResult = sickLeaveRepository.findMonthWithMostSickLeavesInYear(year);

        // Create a new mutable HashMap to avoid TupleBackedMap modification error
        Map<String, Object> result = new HashMap<>();

        if (queryResult != null && !queryResult.isEmpty()) {
            // Copy all data from the immutable query result to our mutable map
            result.putAll(queryResult);

            // Add the year parameter since it's not in the query result
            result.put("year", year);

            // Add the month name in English
            Integer month = (Integer) queryResult.get("month");
            if (month != null) {
                result.put("monthName", getMonthNameInEnglish(month));
            }

            // Add summary message
            Long count = ((Number) queryResult.get("count")).longValue();
            String monthName = getMonthNameInEnglish(month);

            String summary = String.format(
                    "In %s %d, the most sick leaves were issued for that year - total of %d sick leaves.",
                    monthName, year, count
            );
            result.put("summary", summary);
            result.put("hasSickLeaves", true);
        } else {
            result.put("message", String.format("No sick leave data available for year %d", year));
            result.put("year", year);
            result.put("hasSickLeaves", false);
        }

        return result;
    }

    private String getMonthNameInEnglish(Integer month) {
        if (month == null) return "Unknown";
        return switch (month) {
            case 1 -> "January";
            case 2 -> "February";
            case 3 -> "March";
            case 4 -> "April";
            case 5 -> "May";
            case 6 -> "June";
            case 7 -> "July";
            case 8 -> "August";
            case 9 -> "September";
            case 10 -> "October";
            case 11 -> "November";
            case 12 -> "December";
            default -> "Unknown";
        };
    }
}
