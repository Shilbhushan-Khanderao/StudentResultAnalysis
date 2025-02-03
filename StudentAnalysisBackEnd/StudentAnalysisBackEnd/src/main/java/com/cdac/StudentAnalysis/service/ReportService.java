package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.RankingRepository;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ReportService {

    private final StudentRepository studentRepository;
    private final ScoreRepository scoreRepository;
    private final RankingRepository rankingRepository;

    public ReportService(StudentRepository studentRepository, ScoreRepository scoreRepository, RankingRepository rankingRepository) {
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
        this.rankingRepository = rankingRepository;
    }

    // 1. Generate Student Report (Excel)
    public ByteArrayInputStream generateStudentExcelReport(Long studentId) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            List<Score> scores = scoreRepository.findByStudent(student);

            Sheet sheet = workbook.createSheet("Student Report");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Subject");
            headerRow.createCell(1).setCellValue("Theory Marks");
            headerRow.createCell(2).setCellValue("IA Marks");
            headerRow.createCell(3).setCellValue("Lab Marks");
            headerRow.createCell(4).setCellValue("Total Marks");

            // Data Rows
            int rowNum = 1;
            for (Score score : scores) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(score.getSubject().getName());
                row.createCell(1).setCellValue(score.getTheoryMarks());
                row.createCell(2).setCellValue(score.getIaMarks());
                row.createCell(3).setCellValue(score.getLabMarks());
                row.createCell(4).setCellValue(score.getTotalMarks());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } finally {
//            workbook.close();
            out.close();
        }
    }

    // 2. Generate Batch Report (Excel) with Rank Data
    public ByteArrayInputStream generateBatchExcelReport(Long batchId) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            List<Student> students = studentRepository.findByBatchId(batchId);
            List<Subject> subjects = scoreRepository.findAllSubjects();

            Sheet sheet = workbook.createSheet("Batch Report");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Student ID");
            headerRow.createCell(1).setCellValue("Student Name");
            int colNum = 2;
            for (Subject subject : subjects) {
                headerRow.createCell(colNum++).setCellValue(subject.getName() + " - TH");
                headerRow.createCell(colNum++).setCellValue(subject.getName() + " - IA");
                headerRow.createCell(colNum++).setCellValue(subject.getName() + " - Lab");
                headerRow.createCell(colNum++).setCellValue(subject.getName() + " - Total");
            }
            headerRow.createCell(colNum++).setCellValue("Project");
            headerRow.createCell(colNum++).setCellValue("Total");
            headerRow.createCell(colNum++).setCellValue("Percentage");
            headerRow.createCell(colNum++).setCellValue("Old Rank");
            headerRow.createCell(colNum++).setCellValue("Rank");
            headerRow.createCell(colNum++).setCellValue("Rank Analysis");

            // Data Rows
            int rowNum = 1;
            for (Student student : students) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(student.getId());
                row.createCell(1).setCellValue(student.getName());

                colNum = 2;
                int totalMarks = 0;
                for (Subject subject : subjects) {
                    Score score = scoreRepository.findByStudentAndSubject(student, subject).orElse(new Score());
                    row.createCell(colNum++).setCellValue(score.getTheoryMarks());
                    row.createCell(colNum++).setCellValue(score.getIaMarks());
                    row.createCell(colNum++).setCellValue(score.getLabMarks());
                    row.createCell(colNum++).setCellValue(score.getTotalMarks());
                    totalMarks += score.getTotalMarks();
                }

                Ranking ranking = rankingRepository.findByStudent(student).orElse(new Ranking());
                int oldRank = ranking.getOldRank();
                int currentRank = ranking.getCurrentRank();
                String rankAnalysis = (oldRank == 0) ? "N/A" : ((oldRank > currentRank) ? "+" + (oldRank - currentRank) : ((oldRank < currentRank) ? "-" + (currentRank - oldRank) : "0"));

                row.createCell(colNum++).setCellValue("N/A");
                row.createCell(colNum++).setCellValue(totalMarks);
                row.createCell(colNum++).setCellValue((totalMarks * 100.0) / (subjects.size() * 100));
                row.createCell(colNum++).setCellValue(oldRank);
                row.createCell(colNum++).setCellValue(currentRank);
                row.createCell(colNum++).setCellValue(rankAnalysis);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } finally {
//            workbook.close();
            out.close();
        }
    }
}