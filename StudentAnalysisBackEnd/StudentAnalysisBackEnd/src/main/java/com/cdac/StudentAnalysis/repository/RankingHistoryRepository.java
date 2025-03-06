package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.RankingHistory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RankingHistoryRepository extends JpaRepository<RankingHistory, Long> {
	
	@Query("SELECT rh FROM RankingHistory rh WHERE rh.student.id = :studentId ORDER BY rh.timestamp")
    List<RankingHistory> findRankHistoryByStudent(@Param("studentId") Long studentId);

}

