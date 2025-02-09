package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.RankingHistory;
import com.cdac.StudentAnalysis.model.Score;
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

    public RankingService(RankingRepository rankingRepository, StudentRepository studentRepository, ScoreRepository scoreRepository, RankingHistoryRepository rankingHistoryRepository) {
        this.rankingRepository = rankingRepository;
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
        this.rankingHistoryRepository = rankingHistoryRepository;
    }

    @Transactional
    public void calculateRanks() {
        List<Student> students = studentRepository.findAll();
        List<Ranking> updatedRankings = new ArrayList<>();
        List<RankingHistory> rankingHistories = new ArrayList<>();

        Map<Student, Integer> marksMap = new HashMap<>();
        boolean hasTheoryMarks = false;

        // Step 1: Check if TH marks exist and compute total marks accordingly
        for (Student student : students) {
            List<Score> scores = scoreRepository.findByStudent(student);
            int totalMarks = 0;

            for (Score score : scores) {
                totalMarks += score.getIaMarks() + score.getLabMarks();
                if (score.getTheoryMarks() > 0) { // Check if TH marks exist for any student
                    totalMarks += score.getTheoryMarks();
                    hasTheoryMarks = true;
                }
            }
            marksMap.put(student, totalMarks);
        }

        // Step 2: Rank Students based on available marks (TH+IA+LAB or IA+LAB)
        rankStudents(marksMap, updatedRankings, rankingHistories, hasTheoryMarks);

        // Step 3: Bulk save rankings & ranking history
        rankingRepository.saveAll(updatedRankings);
        rankingHistoryRepository.saveAll(rankingHistories);
    }

    private void rankStudents(Map<Student, Integer> marksMap, List<Ranking> rankings, List<RankingHistory> histories, boolean hasTheoryMarks) {
        List<Map.Entry<Student, Integer>> sortedStudents = marksMap.entrySet().stream()
                .sorted(Map.Entry.<Student, Integer>comparingByValue().reversed())
                .toList();

        int rank = 1;
        int lastMarks = -1;
        int lastRank = 0;
        int maxMarks = hasTheoryMarks ? 100 : 60; // If TH marks exist, max is 100, otherwise 60

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

            Ranking ranking = rankingRepository.findByStudent(student).orElse(new Ranking());
            ranking.setStudent(student);
            int previousRank = ranking.getCurrentRank();
            ranking.setCurrentRank(rank++);
            ranking.setPercentage((totalMarks * 100.0) / maxMarks); // Adjust percentage based on marks type

            rankings.add(ranking);

            // 🟢 Only save history if the rank changed
            if (previousRank != ranking.getCurrentRank()) {
                histories.add(RankingHistory.builder()
                        .student(student)
                        .ranking(ranking)
                        .oldRank(previousRank)
                        .newRank(ranking.getCurrentRank())
                        .timestamp(LocalDateTime.now())
                        .build());
            }
        }
    }

    public List<Ranking> getAllRankings() {
        return rankingRepository.findAll();
    }

    public Ranking getStudentRanking(Long studentId) {
        return rankingRepository.findByStudent(
                studentRepository.findById(studentId)
                        .orElseThrow(() -> new RuntimeException("Student not found"))
        ).orElseThrow(() -> new RuntimeException("Ranking not found"));
    }

    public List<RankingHistory> getRankingHistory(Long studentId) {
        return rankingHistoryRepository.findAll();
    }
    
    public List<Ranking> getTopRankers(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("currentRank").ascending());
        return rankingRepository.findTopRankers(pageable);
    }
    
    public List<Ranking> getBatchRankings(Long batchId) {
        return rankingRepository.findRankingsByBatch(batchId);
    }

    public List<RankingHistory> getRankComparison(Long studentId) {
        return rankingHistoryRepository.findRankHistoryByStudent(studentId);
    }


}
