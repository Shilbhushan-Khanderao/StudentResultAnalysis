package com.cdac.StudentAnalysis.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.StudentAnalysis.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Object> findByName(String subjectName);
}
