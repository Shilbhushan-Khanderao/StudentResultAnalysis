package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.service.PDFReportService;
import com.cdac.StudentAnalysis.service.ReportService;
import com.itextpdf.text.DocumentException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final PDFReportService pdfReportService;

    public ReportController(ReportService reportService, PDFReportService pdfReportService ) {
        this.reportService = reportService;
        this.pdfReportService = pdfReportService;
    }

    // 1. API for Student Excel Report
    @GetMapping("/student")
    public ResponseEntity<InputStreamResource> downloadStudentReport(@RequestParam Long studentId) {
        try {
            InputStreamResource file = new InputStreamResource(reportService.generateStudentExcelReport(studentId));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=student_report.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/student/pdf")
    public ResponseEntity<InputStreamResource> downloadStudentPDF(@RequestParam Long studentId) throws DocumentException, IOException {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=student_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfReportService.generateStudentPDFReport(studentId)));
    }

    @GetMapping("/batch/pdf")
    public ResponseEntity<InputStreamResource> downloadBatchPDF(@RequestParam Long batchId) throws DocumentException, IOException {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=batch_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfReportService.generateBatchPDFReport(batchId)));
    }
}