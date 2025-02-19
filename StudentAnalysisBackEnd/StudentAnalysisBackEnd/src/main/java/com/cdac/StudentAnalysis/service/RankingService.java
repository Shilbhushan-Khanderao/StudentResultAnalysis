package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.RankingHistory;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.repository.RankingHistoryRepository;
import com.cdac.StudentAnalysis.repository.RankingRepository;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RankingService {

    private final RankingRepository rankingRepository;
    private final StudentRepository studentRepository;
    private final ScoreRepository scoreRepository;
    private final RankingHistoryRepository rankingHistoryRepository;

    public RankingService(RankingRepository rankingRepository, StudentRepository studentRepository,
                          ScoreRepository scoreRepository, RankingHistoryRepository rankingHistoryRepository) {
        this.rankingRepository = rankingRepository;
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
        this.rankingHistoryRepository = rankingHistoryRepository;
    }

    /**
     * Calculate and update ranks for all students.
     */
    @Transactional
    public void calculateRanks() {
        // Fetch all scores in one query to avoid N+1 problem
        List<Object[]> results = scoreRepository.getStudentTotalMarks(); // Custom query to fetch total marks per student

        Map<Student, Integer> marksMap = new HashMap<>();
        boolean hasTheoryMarks = false;

        // Prepare data for ranking
        for (Object[] result : results) {
            Student student = (Student) result[0];
            int totalMarks = ((Number) result[1]).intValue();

            // Detect if theory marks are present
            hasTheoryMarks = hasTheoryMarks || totalMarks > 60;
            marksMap.put(student, totalMarks);
        }

        List<Ranking> updatedRankings = new ArrayList<>();
        List<RankingHistory> rankingHistories = new ArrayList<>();

        // Rank students based on total marks
        rankStudents(marksMap, updatedRankings, rankingHistories, hasTheoryMarks);

        // Batch save updated rankings and ranking history
        rankingRepository.saveAll(updatedRankings);
        rankingHistoryRepository.saveAll(rankingHistories);
    }

    /**
     * Rank students based on total marks and maintain ranking history.
     */
    private void rankStudents(Map<Student, Integer> marksMap, List<Ranking> rankings, List<RankingHistory> histories, boolean hasTheoryMarks) {
        // Preload existing rankings for efficient access
        List<Ranking> existingRankings = rankingRepository.findAll();
        Map<Long, Ranking> studentRankMap = new HashMap<>();
        for (Ranking ranking : existingRankings) {
            studentRankMap.put(ranking.getStudent().getId(), ranking);
        }

        // Sort students by total marks (descending)
        List<Map.Entry<Student, Integer>> sortedStudents = marksMap.entrySet().stream()
                .sorted(Map.Entry.<Student, Integer>comparingByValue().reversed())
                .toList();

        int rank = 1;
        int lastMarks = -1;
        int lastRank = 0;
        int maxMarks = hasTheoryMarks ? 100 : 60;

        for (Map.Entry<Student, Integer> entry : sortedStudents) {
            Student student = entry.getKey();
            int totalMarks = entry.getValue();

            // Handle ties (same marks → same rank)
            if (totalMarks == lastMarks) {
                rank = lastRank;
            } else {
                lastRank = rank;
            }
            lastMarks = totalMarks;

            // Use preloaded ranking or create new
            Ranking ranking = studentRankMap.getOrDefault(student.getId(), new Ranking());
            ranking.setStudent(student);

            int previousRank = ranking.getCurrentRank() == 0 ? rank : ranking.getCurrentRank();
            ranking.setCurrentRank(rank++);
            ranking.setPercentage((totalMarks * 100.0) / maxMarks);

            rankings.add(ranking); // Add to batch save

            // Save ranking history only if rank changed
            if (previousRank != ranking.getCurrentRank()) {
                histories.add(RankingHistory.builder()
                        .student(student)
                        .previousPercentage(ranking.getPercentage())
                        .oldRank(previousRank)
                        .newRank(ranking.getCurrentRank())
                        .timestamp(LocalDateTime.now())
                        .build());
            }
        }
    }

    /**
     * Get all current rankings.
     */
    @Transactional(readOnly = true)
    public List<Ranking> getAllRankings() {
        return rankingRepository.findAll();
    }

    /**
     * Get ranking for a specific student.
     */
    @Transactional(readOnly = true)
    public Ranking getStudentRanking(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return rankingRepository.findByStudent(student)
                .orElseThrow(() -> new RuntimeException("Ranking not found for student"));
    }

    /**
     * Get ranking history for a student.
     */
    @Transactional(readOnly = true)
    public List<RankingHistory> getRankingHistory(Long studentId) {
        return rankingHistoryRepository.findRankHistoryByStudent(studentId);
    }

    /**
     * Get top N students by rank.
     */
    @Transactional(readOnly = true)
    public List<Ranking> getTopRankers(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("currentRank").ascending());
        return rankingRepository.findTopRankers(pageable);
    }

    /**
     * Get rankings for a specific batch.
     */
    @Transactional(readOnly = true)
    public List<Ranking> getBatchRankings(Long batchId) {
        return rankingRepository.findRankingsByBatch(batchId);
    }

    /**
     * Compare current and past rankings for a specific student.
     */
    @Transactional(readOnly = true)
    public List<RankingHistory> getRankComparison(Long studentId) {
        return rankingHistoryRepository.findRankHistoryByStudent(studentId);
    }
}
