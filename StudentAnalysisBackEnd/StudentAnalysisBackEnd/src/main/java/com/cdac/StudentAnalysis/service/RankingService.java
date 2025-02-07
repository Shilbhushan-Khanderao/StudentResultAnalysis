package com.cdac.StudentAnalysis.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.RankingHistory;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.RankingHistoryRepository;
import com.cdac.StudentAnalysis.repository.RankingRepository;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import com.cdac.StudentAnalysis.repository.SubjectRepository;

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
        Map<Student, Integer> iaLabMarksMap = new HashMap<>();
        Map<Student, Integer> thIaLabMarksMap = new HashMap<>();

        // Step 1: Compute IA+LAB and TH+IA+LAB total marks
        for (Student student : students) {
            List<Score> scores = scoreRepository.findByStudent(student);

            int iaLabMarks = 0;
            int thIaLabMarks = 0;

            for (Score score : scores) {
                Subject subject = score.getSubject();
                int theoryMarks = score.getTheoryMarks();
                int iaMarks = score.getIaMarks();
                int labMarks = score.getLabMarks();

                // 🟢 Check if the subject is "Combined" using some identifier (adjust as per your DB)
                boolean isCombined = subject.getName().toLowerCase().contains("combined");

                // ✅ Calculate IA+LAB total (Max: 60 for regular, 30 for combined)
                iaLabMarks += (isCombined ? (iaMarks + labMarks) : (iaMarks + labMarks));

                // ✅ Calculate TH+IA+LAB total (Max: 100 for both types)
                if (theoryMarks > 0) {
                    thIaLabMarks += (theoryMarks + iaMarks + labMarks);
                }
            }

            iaLabMarksMap.put(student, iaLabMarks);
            thIaLabMarksMap.put(student, thIaLabMarks);
        }

        // Step 2: Sort students based on IA+LAB and TH+IA+LAB marks
        List<Map.Entry<Student, Integer>> sortedIALabStudents = iaLabMarksMap.entrySet().stream()
                .sorted(Map.Entry.<Student, Integer>comparingByValue().reversed())
                .toList();

        List<Map.Entry<Student, Integer>> sortedTHIALabStudents = thIaLabMarksMap.entrySet().stream()
                .sorted(Map.Entry.<Student, Integer>comparingByValue().reversed())
                .toList();

        int iaLabRank = 1;
        int thIaLabRank = 1;
        
        int maxIALabMarks = 60 * students.size();
        int maxTHIALabMarks = 100 * students.size();

        for (Map.Entry<Student, Integer> entry : sortedIALabStudents) {
            Student student = entry.getKey();
            int totalMarks = entry.getValue();

            Ranking ranking = rankingRepository.findByStudent(student).orElse(new Ranking());
            ranking.setStudent(student);
            ranking.setOldRank(ranking.getCurrentRank());
            ranking.setCurrentRank(iaLabRank++);
            ranking.setPercentage((totalMarks * 100.0) / maxIALabMarks);

            rankingRepository.save(ranking);

            RankingHistory rankingHistory = RankingHistory.builder()
                    .student(student)
                    .rankType("IA_LAB")
                    .oldRank(ranking.getOldRank())
                    .currentRank(ranking.getCurrentRank())
                    .percentage(ranking.getPercentage())
                    .build();

            rankingHistoryRepository.save(rankingHistory);
        }

        for (Map.Entry<Student, Integer> entry : sortedTHIALabStudents) {
            Student student = entry.getKey();
            int totalMarks = entry.getValue();

            Ranking ranking = rankingRepository.findByStudent(student).orElse(new Ranking());
            ranking.setStudent(student);
            ranking.setOldRank(ranking.getCurrentRank());
            ranking.setCurrentRank(thIaLabRank++);
            ranking.setPercentage((totalMarks * 100.0) / maxTHIALabMarks);

            rankingRepository.save(ranking);

            RankingHistory rankingHistory = RankingHistory.builder()
                    .student(student)
                    .rankType("TH_IA_LAB")
                    .oldRank(ranking.getOldRank())
                    .currentRank(ranking.getCurrentRank())
                    .percentage(ranking.getPercentage())
                    .build();

            rankingHistoryRepository.save(rankingHistory);
        }
    }
}

