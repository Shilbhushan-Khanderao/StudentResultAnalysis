package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.repository.RankingRepository;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ScoreRepository scoreRepository;
    private final RankingRepository rankingRepository;
    private final StudentRepository studentRepository;

    public AnalyticsService(ScoreRepository scoreRepository, RankingRepository rankingRepository, StudentRepository studentRepository) {
        this.scoreRepository = scoreRepository;
        this.rankingRepository = rankingRepository;
        this.studentRepository = studentRepository;
    }

    // 1. Get Top N Performers in a Batch
    public List<Ranking> getTopPerformers(Long batchId, int limit) {
        return rankingRepository.findTopPerformersByBatch(batchId, limit);
    }

    // 2. Get Subject-Wise Average Marks
    public Map<String, Double> getSubjectWiseAverages() {
        List<Subject> subjects = scoreRepository.findAllSubjects();
        Map<String, Double> subjectAverages = new HashMap<>();

        for (Subject subject : subjects) {
            double avgMarks = scoreRepository.findBySubject(subject).stream()
                    .mapToInt(Score::getTotalMarks)
                    .average()
                    .orElse(0);
            subjectAverages.put(subject.getName(), avgMarks);
        }
        return subjectAverages;
    }

    // 3. Get Batch-Wise Performance
    public Map<String, Double> getBatchWisePerformance() {
        List<Student> students = studentRepository.findAll();
        Map<String, List<Integer>> batchMarksMap = new HashMap<>();

        for (Student student : students) {
            String batchName = student.getBatch().getBatchName();
            int totalMarks = scoreRepository.findByStudent(student).stream()
                    .mapToInt(Score::getTotalMarks).sum();

            batchMarksMap.computeIfAbsent(batchName, k -> new ArrayList<>()).add(totalMarks);
        }

        Map<String, Double> batchPerformance = new HashMap<>();
        for (Map.Entry<String, List<Integer>> entry : batchMarksMap.entrySet()) {
            double avgMarks = entry.getValue().stream().mapToInt(Integer::intValue).average().orElse(0);
            batchPerformance.put(entry.getKey(), avgMarks);
        }
        return batchPerformance;
    }

    // 4. Get Student Rank Progress
    public Map<String, Object> getRankProgress(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Ranking ranking = rankingRepository.findByStudent(student)
                .orElseThrow(() -> new RuntimeException("Ranking not found"));

        Map<String, Object> progress = new HashMap<>();
        progress.put("studentName", student.getName());
        progress.put("oldRank", ranking.getOldRank());
        progress.put("newRank", ranking.getCurrentRank());
        progress.put("rankChange", ranking.getOldRank() - ranking.getCurrentRank());

        return progress;
    }

    // 5. Get Pass/Fail Analysis for a Subject
    public Map<String, Integer> getPassFailAnalysis(Long subjectId, int passingMarks) {
        Subject subject = scoreRepository.findSubjectById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        List<Score> scores = scoreRepository.findBySubject(subject);
        int passed = (int) scores.stream().filter(score -> score.getTotalMarks() >= passingMarks).count();
        int failed = scores.size() - passed;

        Map<String, Integer> result = new HashMap<>();
        result.put("Passed", passed);
        result.put("Failed", failed);
        return result;
    }

    // 6. Get Subject-Wise Top Performers
    public List<Score> getSubjectTopPerformers(Long subjectId, int limit) {
        Subject subject = scoreRepository.findSubjectById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        return scoreRepository.findBySubject(subject).stream()
                .sorted(Comparator.comparingInt(Score::getTotalMarks).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    // 7. Batch-to-Batch Performance Comparison
    public Map<String, Double> compareBatchPerformance(Long batchId1, Long batchId2) {
        double batch1Avg = calculateBatchAverage(batchId1);
        double batch2Avg = calculateBatchAverage(batchId2);

        Map<String, Double> comparison = new HashMap<>();
        comparison.put("Batch " + batchId1, batch1Avg);
        comparison.put("Batch " + batchId2, batch2Avg);

        return comparison;
    }

    private double calculateBatchAverage(Long batchId) {
        List<Student> students = studentRepository.findByBatchId(batchId);
        return students.stream()
                .flatMap(student -> scoreRepository.findByStudent(student).stream())
                .mapToInt(Score::getTotalMarks)
                .average()
                .orElse(0);
    }

    // 8. Subject-Wise Batch Comparison
    public Map<String, Double> compareBatchSubjectPerformance(Long subjectId) {
        Subject subject = scoreRepository.findSubjectById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Map<String, List<Integer>> batchScores = new HashMap<>();

        List<Score> scores = scoreRepository.findBySubject(subject);
        for (Score score : scores) {
            String batchName = score.getStudent().getBatch().getBatchName();
            batchScores.computeIfAbsent(batchName, k -> new ArrayList<>()).add(score.getTotalMarks());
        }

        Map<String, Double> result = new HashMap<>();
        for (Map.Entry<String, List<Integer>> entry : batchScores.entrySet()) {
            double avgMarks = entry.getValue().stream().mapToInt(Integer::intValue).average().orElse(0);
            result.put(entry.getKey(), avgMarks);
        }
        return result;
    }
}
