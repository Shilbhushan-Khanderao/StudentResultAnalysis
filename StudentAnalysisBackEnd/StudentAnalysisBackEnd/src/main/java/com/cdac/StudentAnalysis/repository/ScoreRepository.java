package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {
	
	List<Score> findAll();
	
	@Query("SELECT COUNT(s) > 0 FROM Score s WHERE s.subject = :subject AND s.theoryMarks > 0")
	boolean existsBySubjectAndTheoryMarksGreaterThan(@Param("subject") Subject subject, int minTheoryMarks);
	
	@Query("SELECT s FROM Score s WHERE s.student.batch.id = :batchId")
		List<Score> findScoresByBatch(@Param("batchId") Long batchId);

	 
    Optional<Score> findByStudentAndSubject(Student student, Subject subject);

    List<Score> findByStudent(Student student);
    List<Score> findBySubject(Subject subject);

    @Query("SELECT DISTINCT s.subject FROM Score s")
    List<Subject> findAllSubjects();

    @Query("SELECT s.subject FROM Score s WHERE s.subject.id = :subjectId")
    Optional<Subject> findSubjectById(Long subjectId);
    
    @Query("SELECT s FROM Score s WHERE s.student.rollNumber = :rollNumber")
    List<Score> findScoresByStudentRollNumber(@Param("rollNumber") String rollNumber);

    @Query("SELECT s FROM Score s WHERE s.subject.name = :subjectName")
    List<Score> findScoresBySubjectName(@Param("subjectName") String subjectName);
    
    @Query("SELECT s.student, SUM(s.theoryMarks + s.iaMarks + s.labMarks) FROM Score s GROUP BY s.student")
    List<Object[]> getStudentTotalMarks();
    
    
    @Transactional
    void deleteByStudentAndSubject(Student student, Subject subject);

    @Transactional
    void deleteByStudent(Student student);

    @Transactional
    void deleteBySubject(Subject subject);

    List<Score> findScoresByStudent_Batch_Id(Long batchId);
}
