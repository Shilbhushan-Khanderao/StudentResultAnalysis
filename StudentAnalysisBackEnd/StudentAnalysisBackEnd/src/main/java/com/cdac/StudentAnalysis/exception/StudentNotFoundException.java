package com.cdac.StudentAnalysis.exception;

public class StudentNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public StudentNotFoundException(String rollNumber) {
        super("Student not found with roll number: " + rollNumber);
    }
}
