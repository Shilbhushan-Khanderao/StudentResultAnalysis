package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.exception.StudentNotFoundException;
import com.cdac.StudentAnalysis.exception.SubjectNotFoundException;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import com.cdac.StudentAnalysis.repository.SubjectRepository;
import com.cdac.StudentAnalysis.utils.MarksheetUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScoreService {

    private static final Logger logger = LoggerFactory.getLogger(ScoreService.class);

    private final ScoreRepository scoreRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final MarksheetUtils marksheetUtils;

    public ScoreService(ScoreRepository scoreRepository, StudentRepository studentRepository, SubjectRepository subjectRepository, MarksheetUtils marksheetUtils) {
        this.scoreRepository = scoreRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.marksheetUtils = marksheetUtils;
    }
    
    /**
     * Fetch all scores for all students and subjects.
     */
    @Transactional(readOnly = true)
    public List<Score> getAllScores() {
        logger.info("Fetching all scores...");
        return scoreRepository.findAll();
    }
    
    //Get Marksheet for all students of a batch
    public List<Map<String, Object>> getFormattedMarksheet(Long batchId) {
        List<Score> scores = scoreRepository.findScoresByBatch(batchId);
        
        int totalMaxMarks = subjectRepository.findAll().stream()
                .mapToInt(marksheetUtils::determineSubjectMax)
                .sum();
        
        Map<String, Map<String, Object>> studentMap = new LinkedHashMap<>();

        for (Score score : scores) {
            String studentId = score.getStudent().getRollNumber();
            String studentName = score.getStudent().getName();
            String subject = score.getSubject().getName();
            String subjectType = score.getSubject().getType();
            
            // Ensure student entry exists
            studentMap.putIfAbsent(studentId, new LinkedHashMap<>());
            Map<String, Object> studentData = studentMap.get(studentId);

            // Add basic student details
            studentData.put("Student ID", studentId);
            studentData.put("Student Name", studentName);
            
            if(subjectType.equalsIgnoreCase("GRADED")) {
            	studentData.put(subject, score.getGrade());
            } else {            
            // Add marks for the subject
            studentData.put(subject, Map.of(
                "TH", score.getTheoryMarks(),
                "IA", score.getIaMarks(),
                "Lab", score.getLabMarks(),
                "TOT", score.getTheoryMarks() + score.getIaMarks() + score.getLabMarks()
            ));
            
            int existingTotal = (int) studentData.getOrDefault("Total", 0);
            studentData.put("Total", existingTotal + score.getTotalMarks());
            }
        }
        
        studentMap.forEach((studentId, studentData) -> {
            int totalMarks = (int) studentData.getOrDefault("Total", 0);
            double percentage = totalMaxMarks > 0 ? (totalMarks * 100.0) / totalMaxMarks : 0.0;
            studentData.put("Percentage", String.format("%.2f", percentage));
        });


        return new ArrayList<>(studentMap.values());
    }
    
    //Get Marksheet for a specific subject or list of subjects
    public List<Map<String, Object>> getMarksheetForSubjects(Long batchId, List<Long> subjectIds) {
        List<Score> scores = scoreRepository.findScoresByBatch(batchId);
        Map<String, Map<String, Object>> studentMap = new LinkedHashMap<>();

        for (Score score : scores) {
            if (!subjectIds.contains(score.getSubject().getId())) {
                continue; // Ignore subjects not in the list
            }

            String studentId = score.getStudent().getRollNumber();
            String studentName = score.getStudent().getName();
            String subject = score.getSubject().getName();
            String subjectType = score.getSubject().getType();

            studentMap.putIfAbsent(studentId, new LinkedHashMap<>());
            Map<String, Object> studentData = studentMap.get(studentId);

            studentData.put("Student ID", studentId);
            studentData.put("Student Name", studentName);
            
            if(subjectType.equalsIgnoreCase("GRADED")) {
            	studentData.put(subject, score.getGrade());
            } else {            
            // Add marks for the subject
	            studentData.put(subject, Map.of(
	                "TH", score.getTheoryMarks(),
	                "IA", score.getIaMarks(),
	                "Lab", score.getLabMarks(),
	                "TOT", score.getTheoryMarks() + score.getIaMarks() + score.getLabMarks()
	            ));
            }
        }

        return new ArrayList<>(studentMap.values());
    }


    
    /**
     * Fetch all scores for a given student roll number.
     */
    @Transactional(readOnly = true)
    public List<Score> getScoresByStudentRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new StudentNotFoundException(rollNumber));
        
        return scoreRepository.findByStudent(student);
    }

    /**
     * Fetch all scores for a given subject.
     */
    @Transactional(readOnly = true)
    public List<Score> getScoresBySubjectName(String subjectName) {
        Subject subject = subjectRepository.findByName(subjectName)
                .orElseThrow(() -> new SubjectNotFoundException(subjectName));

        return scoreRepository.findBySubject(subject);
    }

    /**
     * Upload marks for a single subject from a CSV file.
     */
    @Transactional
    public void importSingleSubjectMarks(MultipartFile file, String subjectName) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            logger.info("Processing file for subject: {}", subjectName);
            Subject subject = subjectRepository.findByName(subjectName)
                    .orElseThrow(() -> new SubjectNotFoundException(subjectName));

            List<Score> scores = new ArrayList<>();
            String line = reader.readLine();
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length < 4) continue; // Skip invalid rows

                String rollNumber = data[0];
                int theoryMarks = Integer.parseInt(data[1]);
                int iaMarks = Integer.parseInt(data[2]);
                int labMarks = Integer.parseInt(data[3]);

                Student student = studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new StudentNotFoundException(rollNumber));

                Score score = Score.builder()
                        .student(student)
                        .subject(subject)
                        .theoryMarks(theoryMarks)
                        .iaMarks(iaMarks)
                        .labMarks(labMarks)
                        .build();

                scores.add(score);
            }
            scoreRepository.saveAll(scores);
            logger.info("Successfully uploaded marks for {}", subjectName);
        } catch (Exception e) {
            logger.error("Error processing file: {}", e.getMessage(), e);
            throw new RuntimeException("Error processing CSV file");
        }
    }

    /**
     * Upload marks for multiple subjects from a CSV file.
     */
    @Transactional
    public void importMultiSubjectMarks(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String[] subjects = reader.readLine().split(",");
            reader.readLine(); // Skip headers row
            String line;
            List<Score> scores = new ArrayList<>();

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length < 4) continue; // Skip invalid rows

                String rollNumber = data[0];
                Student student = studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new StudentNotFoundException(rollNumber));

                int index = 1;
                for (String subjectName : subjects) {
                    Subject subject = subjectRepository.findByName(subjectName)
                            .orElseThrow(() -> new SubjectNotFoundException(subjectName));

                    int theoryMarks = Integer.parseInt(data[index++]);
                    int iaMarks = Integer.parseInt(data[index++]);
                    int labMarks = Integer.parseInt(data[index++]);

                    Score score = Score.builder()
                            .student(student)
                            .subject(subject)
                            .theoryMarks(theoryMarks)
                            .iaMarks(iaMarks)
                            .labMarks(labMarks)
                            .build();

                    scores.add(score);
                }
            }
            scoreRepository.saveAll(scores);
            logger.info("Successfully uploaded marks for multiple subjects.");
        } catch (Exception e) {
            logger.error("Error processing file: {}", e.getMessage(), e);
            throw new RuntimeException("Error processing CSV file");
        }
    }
    
    // Upload Project and GAC grades via CSV.
    @Transactional
    public void importProjectAndGACGrades(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            // Fetch Project and GAC subjects
            Subject projectSubject = subjectRepository.findByName("Project")
                    .orElseThrow(() -> new SubjectNotFoundException("Project"));

            Subject gacSubject = subjectRepository.findByName("GAC")
                    .orElseThrow(() -> new SubjectNotFoundException("GAC"));
            
            logger.info("Project Type: " + projectSubject.getType() + "GAC Type: " + gacSubject.getType());
            

            // Ensure both subjects are graded subjects
            if (!projectSubject.getType().equalsIgnoreCase("GRADED") || !gacSubject.getType().equalsIgnoreCase("GRADED")) {
                throw new IllegalArgumentException("Project and GAC must be GRADED subjects");
            }

            String line = reader.readLine(); // Read header
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length < 3) continue; // Skip invalid rows

                String rollNumber = data[0].trim();
                String projectGrade = data[1].trim();
                String gacGrade = data[2].trim();

                // Fetch student
                Student student = studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new StudentNotFoundException(rollNumber));

                // Save Project Grade
                Score projectScore = scoreRepository.findByStudentAndSubject(student, projectSubject)
                        .orElse(new Score(student, projectSubject));
                projectScore.setGrade(projectGrade);
                projectScore.setTotalMarks(0); // Ensure totalMarks is null for graded subjects
                scoreRepository.save(projectScore);

                // Save GAC Grade
                Score gacScore = scoreRepository.findByStudentAndSubject(student, gacSubject)
                        .orElse(new Score(student, gacSubject));
                gacScore.setGrade(gacGrade);
                gacScore.setTotalMarks(0);
                scoreRepository.save(gacScore);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing CSV file", e);
        }
    }


    //Update marks for a single student and subject.
    @Transactional
    public void updateSingleStudentMarks(String rollNumber, String subjectName, int theoryMarks, int iaMarks, int labMarks) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new StudentNotFoundException(rollNumber));

        Subject subject = subjectRepository.findByName(subjectName)
                .orElseThrow(() -> new SubjectNotFoundException(subjectName));

        Score score = scoreRepository.findByStudentAndSubject(student, subject)
                .orElse(new Score(student, subject));

        score.setTheoryMarks(theoryMarks);
        score.setIaMarks(iaMarks);
        score.setLabMarks(labMarks);

        scoreRepository.save(score);
        logger.info("Updated marks for student {}", rollNumber);
    }

    //Bulk update marks for multiple students from a CSV file.
    @Transactional
    public void updateMarksFromCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String[] subjects = reader.readLine().split(",");
            reader.readLine(); // Skip headers row
            String line;
            List<Score> scores = new ArrayList<>();

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length < 4) continue; // Skip invalid rows

                String rollNumber = data[0];
                Student student = (Student) studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new StudentNotFoundException(rollNumber));

                int index = 1;
                for (String subjectName : subjects) {
                    Subject subject = (Subject) subjectRepository.findByName(subjectName)
                            .orElseThrow(() -> new SubjectNotFoundException(subjectName));

                    int theoryMarks = Integer.parseInt(data[index++]);
                    int iaMarks = Integer.parseInt(data[index++]);
                    int labMarks = Integer.parseInt(data[index++]);

                    Score score = scoreRepository.findByStudentAndSubject(student, subject)
                            .orElse(new Score(student, subject));

                    score.setTheoryMarks(theoryMarks);
                    score.setIaMarks(iaMarks);
                    score.setLabMarks(labMarks);

                    scores.add(score);
                }
            }
            scoreRepository.saveAll(scores);
            logger.info("Successfully updated marks from CSV.");
        } catch (Exception e) {
            logger.error("Error processing file: {}", e.getMessage(), e);
            throw new RuntimeException("Error processing CSV file");
        }
    }
    
    //Delete Score for a student of a subject
    @Transactional
    public void deleteScoreForStudent(Long studentId, Long subjectId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        scoreRepository.deleteByStudentAndSubject(student, subject);
    }

    //Delete scores of all subjects for a student
    @Transactional
    public void deleteAllScoresForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        scoreRepository.deleteByStudent(student);
    }

    //Delete score of a subject for all the students
    @Transactional
    public void deleteScoreForAllStudents(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        scoreRepository.deleteBySubject(subject);
    }

    //Delete scores of all students for all subjects
    @Transactional
    public void deleteAllScores() {
        scoreRepository.deleteAll();
    }
}
