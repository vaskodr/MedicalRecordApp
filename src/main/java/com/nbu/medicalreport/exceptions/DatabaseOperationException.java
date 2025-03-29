package com.nbu.medicalreport.exceptions;

import org.springframework.dao.DataIntegrityViolationException;

public class DatabaseOperationException extends Throwable {
    public DatabaseOperationException(String errorCreatingUser, DataIntegrityViolationException e) {
    }
}
