package com.cdac.StudentAnalysis.exception;

public class SubjectNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public SubjectNotFoundException(String subjectName) {
        super("Subject not found: " + subjectName);
    }
}
