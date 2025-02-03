package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VisualizationService {

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ Student Performance Data
    public Map<String, Object> getStudentPerformanceData(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Score> scores = scoreRepository.findByStudent(student);
        List<String> labels = scores.stream().map(score -> score.getSubject().getName()).collect(Collectors.toList());
        List<Integer> data = scores.stream().map(Score::getTotalMarks).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("data", data);
        return response;
    }

    // ✅ Batch Performance Data (Fixed)
    public Map<String, Object> getBatchPerformanceData(Long batchId) {
        // Step 1: Fetch students in the batch
        List<Student> studentsInBatch = studentRepository.findByBatchId(batchId);

        // Step 2: Fetch scores for each student
        Map<String, List<Integer>> subjectScores = new HashMap<>();
        for (Student student : studentsInBatch) {
            List<Score> scores = scoreRepository.findByStudent(student);
            for (Score score : scores) {
                String subjectName = score.getSubject().getName();
                subjectScores.computeIfAbsent(subjectName, k -> new ArrayList<>()).add(score.getTotalMarks());
            }
        }

        // Step 3: Calculate average marks per subject
        List<String> labels = new ArrayList<>(subjectScores.keySet());
        List<Double> averageScores = subjectScores.values().stream()
                .map(marks -> marks.stream().mapToInt(Integer::intValue).average().orElse(0))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("data", averageScores);
        return response;
    }
}