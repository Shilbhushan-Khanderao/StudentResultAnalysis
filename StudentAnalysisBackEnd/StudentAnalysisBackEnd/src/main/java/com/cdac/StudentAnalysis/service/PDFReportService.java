package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.RankingRepository;
import com.cdac.StudentAnalysis.repository.ScoreRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

@Service
public class PDFReportService {

    private final StudentRepository studentRepository;
    private final ScoreRepository scoreRepository;
    private final RankingRepository rankingRepository;

    public PDFReportService(StudentRepository studentRepository, ScoreRepository scoreRepository, RankingRepository rankingRepository) {
        this.studentRepository = studentRepository;
        this.scoreRepository = scoreRepository;
        this.rankingRepository = rankingRepository;
    }

    // 1. Generate Student Report (PDF)
    public ByteArrayInputStream generateStudentPDFReport(Long studentId) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Score> scores = scoreRepository.findByStudent(student);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph title = new Paragraph("Student Report - " + student.getName(), font);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{4, 3, 3, 3, 3});

            Stream.of("Subject", "Theory Marks", "IA Marks", "Lab Marks", "Total Marks")
                    .forEach(headerTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setPhrase(new Phrase(headerTitle));
                        table.addCell(header);
                    });

            for (Score score : scores) {
                table.addCell(score.getSubject().getName());
                table.addCell(String.valueOf(score.getTheoryMarks()));
                table.addCell(String.valueOf(score.getIaMarks()));
                table.addCell(String.valueOf(score.getLabMarks()));
                table.addCell(String.valueOf(score.getTotalMarks()));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // 2. Generate Batch Report (PDF)
    public ByteArrayInputStream generateBatchPDFReport(Long batchId) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        List<Student> students = studentRepository.findByBatchId(batchId);
        List<Subject> subjects = scoreRepository.findAllSubjects();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph title = new Paragraph("Batch Report", font);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(subjects.size() * 4 + 6);
            table.setWidthPercentage(100);

            table.addCell("Student ID");
            table.addCell("Student Name");

            for (Subject subject : subjects) {
                table.addCell(subject.getName() + " - TH");
                table.addCell(subject.getName() + " - IA");
                table.addCell(subject.getName() + " - Lab");
                table.addCell(subject.getName() + " - Total");
            }

            table.addCell("Total");
            table.addCell("Percentage");
            table.addCell("Old Rank");
            table.addCell("New Rank");
            table.addCell("Rank Analysis");

            for (Student student : students) {
                table.addCell(String.valueOf(student.getId()));
                table.addCell(student.getName());

                int totalMarks = 0;
                for (Subject subject : subjects) {
                    Score score = scoreRepository.findByStudentAndSubject(student, subject).orElse(new Score());
                    table.addCell(String.valueOf(score.getTheoryMarks()));
                    table.addCell(String.valueOf(score.getIaMarks()));
                    table.addCell(String.valueOf(score.getLabMarks()));
                    table.addCell(String.valueOf(score.getTotalMarks()));
                    totalMarks += score.getTotalMarks();
                }

                Ranking ranking = rankingRepository.findByStudent(student).orElse(new Ranking());
                int oldRank = ranking.getOldRank();
                int newRank = ranking.getCurrentRank();
                String rankAnalysis = (oldRank > newRank) ? "+" + (oldRank - newRank) : ((oldRank < newRank) ? "-" + (newRank - oldRank) : "0");

                table.addCell(String.valueOf(totalMarks));
                table.addCell(String.format("%.2f", (totalMarks * 100.0) / (subjects.size() * 100)));
                table.addCell(String.valueOf(oldRank));
                table.addCell(String.valueOf(newRank));
                table.addCell(rankAnalysis);
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}

