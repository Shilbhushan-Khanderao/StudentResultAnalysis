package com.cdac.StudentAnalysis.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import com.cdac.StudentAnalysis.repository.SubjectRepository;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public ScoreService(ScoreRepository scoreRepository, StudentRepository studentRepository, SubjectRepository subjectRepository) {
        this.scoreRepository = scoreRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    // Method 1: Upload marks for a single subject
    public void importSingleSubjectMarks(MultipartFile file, String subjectName) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line = reader.readLine();
            Subject subject = (Subject) subjectRepository.findByName(subjectName)
                    .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectName));

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                String rollNumber = data[0];
                int theoryMarks = Integer.parseInt(data[1]);
                int iaMarks = Integer.parseInt(data[2]);
                int labMarks = Integer.parseInt(data[3]);

                Student student = (Student) studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNumber));

                int totalMarks = theoryMarks + iaMarks + labMarks;
                Score score = Score.builder()
                        .student(student)
                        .subject(subject)
                        .theoryMarks(theoryMarks)
                        .iaMarks(iaMarks)
                        .labMarks(labMarks)
                        .totalMarks(totalMarks)
                        .build();

                scoreRepository.save(score);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Method 2: Upload marks for multiple subjects
    public void importMultiSubjectMarks(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String[] subjects = reader.readLine().split(",");
            reader.readLine(); // Skip second row (TH, IA, Lab, Total headers)
            String line;

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                String rollNumber = data[0];
                Student student = (Student) studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNumber));

                int index = 1;
                for (String subjectName : subjects) {
                    Subject subject = (Subject) subjectRepository.findByName(subjectName)
                            .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectName));

                    int theoryMarks = Integer.parseInt(data[index++]);
                    int iaMarks = Integer.parseInt(data[index++]);
                    int labMarks = Integer.parseInt(data[index++]);

                    int totalMarks = theoryMarks + iaMarks + labMarks;
                    Score score = Score.builder()
                            .student(student)
                            .subject(subject)
                            .theoryMarks(theoryMarks)
                            .iaMarks(iaMarks)
                            .labMarks(labMarks)
                            .totalMarks(totalMarks)
                            .build();

                    scoreRepository.save(score);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Method 3: Update marks for a single student and subject
    public void updateSingleStudentMarks(String rollNumber, String subjectName, int theoryMarks, int iaMarks, int labMarks) {
        Student student = (Student) studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNumber));

        Subject subject = (Subject) subjectRepository.findByName(subjectName)
                .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectName));

        Score score = scoreRepository.findByStudentAndSubject(student, subject)
                .orElse(new Score(student, subject));

        score.setTheoryMarks(theoryMarks);
        score.setIaMarks(iaMarks);
        score.setLabMarks(labMarks);
        score.setTotalMarks(theoryMarks + iaMarks + labMarks);

        scoreRepository.save(score);
    }

    // Method 4: Bulk update marks for multiple students
    public void updateMarksFromCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String[] subjects = reader.readLine().split(",");
            reader.readLine(); // Skip second row (TH, IA, Lab headers)
            String line;

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                String rollNumber = data[0];
                Student student = (Student) studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNumber));

                int index = 1;
                for (String subjectName : subjects) {
                    Subject subject = (Subject) subjectRepository.findByName(subjectName)
                            .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectName));

                    int theoryMarks = Integer.parseInt(data[index++]);
                    int iaMarks = Integer.parseInt(data[index++]);
                    int labMarks = Integer.parseInt(data[index++]);

                    Score score = scoreRepository.findByStudentAndSubject(student, subject)
                            .orElse(new Score(student, subject));

                    score.setTheoryMarks(theoryMarks);
                    score.setIaMarks(iaMarks);
                    score.setLabMarks(labMarks);
                    score.setTotalMarks(theoryMarks + iaMarks + labMarks);

                    scoreRepository.save(score);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

