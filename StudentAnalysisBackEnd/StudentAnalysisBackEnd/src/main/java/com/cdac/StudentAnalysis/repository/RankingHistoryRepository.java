package com.cdac.StudentAnalysis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.StudentAnalysis.model.RankingHistory;

public interface RankingHistoryRepository extends JpaRepository<RankingHistory, Long> {

}
