package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Object> findByRollNumber(String rollNumber);
    List<Student> findByBatchId(Long batchId);
}
