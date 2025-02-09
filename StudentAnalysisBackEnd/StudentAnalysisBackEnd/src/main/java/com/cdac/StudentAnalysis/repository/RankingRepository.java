package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.Student;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RankingRepository extends JpaRepository<Ranking, Long> {
    Optional<Ranking> findByStudent(Student student);
    
    @Query("SELECT r FROM Ranking r ORDER BY r.currentRank ASC")
    List<Ranking> findTopRankers(Pageable pageable);
    
    @Query("SELECT r FROM Ranking r WHERE r.student.batch.id = :batchId ORDER BY r.currentRank ASC")
    List<Ranking> findRankingsByBatch(@Param("batchId") Long batchId);
}

