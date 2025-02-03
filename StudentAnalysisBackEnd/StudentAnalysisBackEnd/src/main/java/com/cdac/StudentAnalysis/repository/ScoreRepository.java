package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findByStudentAndSubject(Student student, Subject subject);

    List<Score> findByStudent(Student student);
    List<Score> findBySubject(Subject subject);
    @Query("SELECT DISTINCT s.subject FROM Score s")
    List<Subject> findAllSubjects();

    @Query("SELECT s.subject FROM Score s WHERE s.subject.id = :subjectId")
    Optional<Subject> findSubjectById(Long subjectId);
}
