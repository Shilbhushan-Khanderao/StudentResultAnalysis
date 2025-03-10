package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.RankingHistory;
import com.cdac.StudentAnalysis.model.Student;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RankingHistoryRepository extends JpaRepository<RankingHistory, Long> {
	
	@Query("SELECT rh FROM RankingHistory rh WHERE rh.student.id = :studentId ORDER BY rh.timestamp")
    List<RankingHistory> findRankHistoryByStudent(@Param("studentId") Long studentId);

	@Query("SELECT rh FROM RankingHistory rh WHERE rh.student = :student ORDER BY rh.timestamp DESC LIMIT 1")
	Optional<RankingHistory> findTopByStudentOrderByTimestampDesc(@Param("student") Student student);

}

