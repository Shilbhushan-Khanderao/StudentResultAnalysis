package com.cdac.StudentAnalysis.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.repository.RankingRepository;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;

@Service
public class RankingService {

    private final RankingRepository rankingRepository;
    private final StudentRepository studentRepository;
    private final ScoreRepository scoreRepository;

    public RankingService(RankingRepository rankingRepository, StudentRepository studentRepository, ScoreRepository scoreRepository) {
        this.rankingRepository = rankingRepository;
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
    }
    
    // Get all rankings
    public List<Ranking> getAllRankings() {
        return rankingRepository.findAll();
    }

    // Get a student's ranking
    public Ranking getStudentRanking(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        return rankingRepository.findByStudent(student)
                .orElseThrow(() -> new RuntimeException("Ranking not found for student ID: " + studentId));
    }
    
    // Calculate and update rankings for all students
    public void calculateRanks() {
        List<Student> students = studentRepository.findAll();
        Map<Student, Integer> totalMarksMap = new HashMap<>();

        // Aggregate total marks for each student
        for (Student student : students) {
            List<Score> scores = scoreRepository.findByStudent(student);
            int totalMarks = scores.stream().mapToInt(Score::getTotalMarks).sum();
            totalMarksMap.put(student, totalMarks);
        }

        // Sort students by total marks in descending order
        List<Map.Entry<Student, Integer>> sortedStudents = totalMarksMap.entrySet().stream()
                .sorted(Map.Entry.<Student, Integer>comparingByValue().reversed())
                .toList();

        int rank = 1;
        int maxTotalMarks = students.size() * 100; // Assuming 100 is max per subject

        for (Map.Entry<Student, Integer> entry : sortedStudents) {
            Student student = entry.getKey();
            int totalMarks = entry.getValue();

            Ranking ranking = rankingRepository.findByStudent(student).orElse(new Ranking());
            ranking.setStudent(student);
            ranking.setOldRank(ranking.getCurrentRank());
            ranking.setCurrentRank(rank++);
            ranking.setPercentage((totalMarks * 100.0) / maxTotalMarks);

            rankingRepository.save(ranking);
        }
    }
}

