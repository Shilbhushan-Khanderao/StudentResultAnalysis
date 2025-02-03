package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // Get all subjects
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Get a specific subject by ID
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + id));
    }

    // Create a new subject
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    // Update an existing subject
    public Subject updateSubject(Long id, Subject updatedSubject) {
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + id));

        existingSubject.setName(updatedSubject.getName());
        existingSubject.setType(updatedSubject.getType());

        return subjectRepository.save(existingSubject);
    }

    // Delete a subject
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + id));
        subjectRepository.delete(subject);
    }
}
