package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrendAnalysisService {

    private final ScoreRepository scoreRepository;
    private final StudentRepository studentRepository;

    public TrendAnalysisService(ScoreRepository scoreRepository, StudentRepository studentRepository) {
        this.scoreRepository = scoreRepository;
        this.studentRepository = studentRepository;
    }

    // 1. Get Student's Performance Trend Over Time (Subject-wise)
    public Map<String, Object> getStudentTrend(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Score> scores = scoreRepository.findByStudent(student);

        // Group scores by subject and sort by latest score entry
        Map<String, List<Integer>> trendData = new HashMap<>();

        for (Score score : scores) {
            String subjectName = score.getSubject().getName();
            trendData.computeIfAbsent(subjectName, k -> new ArrayList<>()).add(score.getTotalMarks());
        }

        // Sort marks chronologically for each subject
        trendData.forEach((subject, marks) -> marks.sort(Comparator.naturalOrder()));

        Map<String, Object> response = new HashMap<>();
        response.put("studentName", student.getName());
        response.put("trendData", trendData);

        return response;
    }

    // 2. Subject-Wise Trend for All Students (Chronological)
    public Map<String, Double> getSubjectTrend(Long subjectId) {
        Subject subject = scoreRepository.findSubjectById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        List<Score> scores = scoreRepository.findBySubject(subject);

        // Sort scores by assessment date if available
        List<Integer> sortedMarks = scores.stream()
                .map(Score::getTotalMarks)
                .sorted()
                .collect(Collectors.toList());

        double averageTrend = sortedMarks.stream().mapToInt(Integer::intValue).average().orElse(0.0);

        Map<String, Double> result = new HashMap<>();
        result.put(subject.getName(), averageTrend);
        return result;
    }
}